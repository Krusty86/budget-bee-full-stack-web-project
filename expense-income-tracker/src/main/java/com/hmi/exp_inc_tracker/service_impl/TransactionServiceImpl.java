package com.hmi.exp_inc_tracker.service_impl;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hmi.exp_inc_tracker.entity.FinancialAccount;
import com.hmi.exp_inc_tracker.entity.Subscription;
import com.hmi.exp_inc_tracker.entity.Transaction;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.enums.TransactionCategory;
import com.hmi.exp_inc_tracker.enums.TransactionType;
import com.hmi.exp_inc_tracker.exception.BadRequestException;
import com.hmi.exp_inc_tracker.exception.ResourceNotFoundException;
import com.hmi.exp_inc_tracker.repository.FinancialAccountRepository;
import com.hmi.exp_inc_tracker.repository.SubscriptionRepository;
import com.hmi.exp_inc_tracker.repository.TransactionRepository;
import com.hmi.exp_inc_tracker.service.BudgetService;
import com.hmi.exp_inc_tracker.service.TransactionService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class TransactionServiceImpl implements TransactionService {

    private final TransactionRepository transactionRepo;
    private final FinancialAccountRepository accountRepo;
    private final SubscriptionRepository subscriptionRepo;
    private final BudgetService budgetService;

    @Override
    public Transaction createTransaction(Transaction request, User user) {
        validateUser(user);

        Transaction transaction = buildTransaction(request, user);
        applyBalanceEffect(transaction, user);

        Transaction saved = transactionRepo.save(transaction);
        budgetService.recalculateUserBudgets(user);

        return saved;
    }

    @Override
    public Transaction updateTransaction(Long id, Transaction request, User user) {
        validateUser(user);

        Transaction existing = transactionRepo.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        // Reverse the old effect first. The database transaction rolls this back
        // automatically if validation or application of the new transaction fails.
        reverseBalanceEffect(existing, user);

        Transaction replacement = buildTransaction(request, user);
        replacement.setId(existing.getId());
        replacement.setCreatedAt(existing.getCreatedAt());
        replacement.setDeletedAt(existing.getDeletedAt());

        applyBalanceEffect(replacement, user);

        Transaction saved = transactionRepo.save(replacement);
        budgetService.recalculateUserBudgets(user);

        return saved;
    }

    @Override
    public void deleteTransaction(Long id, User user) {
        validateUser(user);

        Transaction transaction = transactionRepo.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        reverseBalanceEffect(transaction, user);
        transactionRepo.delete(transaction);

        budgetService.recalculateUserBudgets(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Transaction getTransaction(Long id, User user) {
        validateUser(user);

        return transactionRepo.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> getAllTransactions(User user) {
        validateUser(user);
        return transactionRepo.findAllByUserIdOrderByTransactionDateDesc(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByCategory(
            TransactionCategory category, User user) {
        validateUser(user);

        if (category == null) {
            throw new BadRequestException("Transaction category is required");
        }

        return transactionRepo.findAllByUserIdAndCategoryOrderByTransactionDateDesc(
                user.getId(), category);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByType(
            TransactionType type, User user) {
        validateUser(user);

        if (type == null) {
            throw new BadRequestException("Transaction type is required");
        }

        return transactionRepo.findAllByUserIdAndTransactionTypeOrderByTransactionDateDesc(
                user.getId(), type);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Transaction> getTransactionsByDateRange(
            LocalDate startDate, LocalDate endDate, User user) {
        validateUser(user);

        if (startDate == null || endDate == null) {
            throw new BadRequestException("Start date and end date are required");
        }
        if (endDate.isBefore(startDate)) {
            throw new BadRequestException("End date cannot be before start date");
        }

        return transactionRepo.findAllByUserIdAndTransactionDateBetweenOrderByTransactionDateDesc(
                user.getId(), startDate, endDate);
    }

    private Transaction buildTransaction(Transaction request, User user) {
        if (request == null) {
            throw new BadRequestException("Transaction details are required");
        }
        if (request.getTransaction_type() == null) {
            throw new BadRequestException("Transaction type is required");
        }
        if (request.getAmount() == null
                || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Transaction amount must be greater than zero");
        }
        if (request.getTransactionDate() == null) {
            throw new BadRequestException("Transaction date is required");
        }

        Transaction transaction = new Transaction();
        transaction.setTransaction_type(request.getTransaction_type());
        transaction.setAmount(request.getAmount());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setNote(request.getNote());
        transaction.setUser(user);

        TransactionType type = request.getTransaction_type();

        switch (type) {
            case EXPENSE, SUBSCRIPTION -> {
                if (request.getFrom_account() == null
                        || request.getFrom_account().getId() == null) {
                    throw new BadRequestException(
                            "A source account is required for an expense");
                }
                if (request.getTo_account() != null) {
                    throw new BadRequestException(
                            "An expense cannot have a destination account");
                }
                if (request.getCategory() == null) {
                    throw new BadRequestException(
                            "A category is required for an expense");
                }

                FinancialAccount from = getOwnedAccount(
                        request.getFrom_account().getId(), user);
                transaction.setFrom_account(from);
                transaction.setCategory(request.getCategory());

                if (request.getSubscription() != null) {
                    if (request.getSubscription().getId() == null) {
                        throw new BadRequestException("Invalid subscription reference");
                    }
                    Subscription subscription = subscriptionRepo
                            .findByIdAndUserId(
                                    request.getSubscription().getId(), user.getId())
                            .orElseThrow(() ->
                                    new ResourceNotFoundException("Subscription not found"));
                    transaction.setSubscription(subscription);
                }
            }
            case INCOME -> {
                if (request.getTo_account() == null
                        || request.getTo_account().getId() == null) {
                    throw new BadRequestException(
                            "A destination account is required for income");
                }
                if (request.getFrom_account() != null) {
                    throw new BadRequestException(
                            "Income cannot have a source account");
                }

                FinancialAccount to = getOwnedAccount(
                        request.getTo_account().getId(), user);
                transaction.setTo_account(to);
                transaction.setCategory(request.getCategory());

                if (request.getSubscription() != null) {
                    throw new BadRequestException(
                            "Income cannot be linked to a subscription");
                }
            }
            case TRANSFER -> {
                if (request.getFrom_account() == null
                        || request.getFrom_account().getId() == null
                        || request.getTo_account() == null
                        || request.getTo_account().getId() == null) {
                    throw new BadRequestException(
                            "Both source and destination accounts are required for a transfer");
                }

                FinancialAccount from = getOwnedAccount(
                        request.getFrom_account().getId(), user);
                FinancialAccount to = getOwnedAccount(
                        request.getTo_account().getId(), user);

                if (Objects.equals(from.getId(), to.getId())) {
                    throw new BadRequestException(
                            "Source and destination accounts must be different");
                }
                if (from.getCurrency() == null || to.getCurrency() == null
                        || !from.getCurrency().equalsIgnoreCase(to.getCurrency())) {
                    throw new BadRequestException(
                            "Transfers between different currencies are not supported");
                }
                if (request.getSubscription() != null) {
                    throw new BadRequestException(
                            "A transfer cannot be linked to a subscription");
                }

                transaction.setFrom_account(from);
                transaction.setTo_account(to);
                transaction.setCategory(null);
            }
        }

        return transaction;
    }

    private FinancialAccount getOwnedAccount(Long accountId, User user) {
        return accountRepo.findByIdAndUserId(accountId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Financial account not found"));
    }

    private void applyBalanceEffect(Transaction transaction, User user) {
        BigDecimal amount = transaction.getAmount();

        switch (transaction.getTransaction_type()) {
            case EXPENSE, SUBSCRIPTION ->
                    adjustBalance(transaction.getFrom_account(), amount.negate(), user);
            case INCOME ->
                    adjustBalance(transaction.getTo_account(), amount, user);
            case TRANSFER -> {
                adjustBalance(transaction.getFrom_account(), amount.negate(), user);
                adjustBalance(transaction.getTo_account(), amount, user);
            }
        }
    }

    private void reverseBalanceEffect(Transaction transaction, User user) {
        BigDecimal amount = transaction.getAmount();

        switch (transaction.getTransaction_type()) {
            case EXPENSE, SUBSCRIPTION ->
                    adjustBalance(transaction.getFrom_account(), amount, user);
            case INCOME ->
                    adjustBalance(transaction.getTo_account(), amount.negate(), user);
            case TRANSFER -> {
                adjustBalance(transaction.getFrom_account(), amount, user);
                adjustBalance(transaction.getTo_account(), amount.negate(), user);
            }
        }
    }

    private void adjustBalance(FinancialAccount account, BigDecimal delta, User user) {
        if (account == null) {
            throw new BadRequestException("Transaction account is missing");
        }

        if (account.getUser() == null
                || !user.getId().equals(account.getUser().getId())) {
            throw new BadRequestException("Transaction account does not belong to this user");
        }

        BigDecimal currentBalance = account.getBalance() == null
                ? BigDecimal.ZERO
                : account.getBalance();

        BigDecimal updatedBalance = currentBalance.add(delta);

        if (updatedBalance.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException(
                    "Insufficient balance in account: " + account.getAccname());
        }

        account.setBalance(updatedBalance);
        accountRepo.save(account);
    }

    private void validateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("Authenticated user is required");
        }
    }
}
