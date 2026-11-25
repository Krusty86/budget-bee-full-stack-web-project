package com.hmi.exp_inc_tracker.service_impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hmi.exp_inc_tracker.dto.BudgetSummary;
import com.hmi.exp_inc_tracker.entity.Budget;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.enums.BudgetCategory;
import com.hmi.exp_inc_tracker.enums.TransactionCategory;
import com.hmi.exp_inc_tracker.enums.TransactionType;
import com.hmi.exp_inc_tracker.exception.BadRequestException;
import com.hmi.exp_inc_tracker.exception.ResourceNotFoundException;
import com.hmi.exp_inc_tracker.repository.BudgetRepository;
import com.hmi.exp_inc_tracker.repository.TransactionRepository;
import com.hmi.exp_inc_tracker.service.BudgetService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class BudgetServiceImpl implements BudgetService {

    private static final List<TransactionType> EXPENSE_TYPES =
            List.of(TransactionType.EXPENSE, TransactionType.SUBSCRIPTION);

    private final BudgetRepository budgetRepo;
    private final TransactionRepository transactionRepo;

    @Override
    public Budget createBudget(Budget budget, User user) {
        validateUser(user);

        if (budget == null) {
            throw new BadRequestException("Budget details are required");
        }

        validateRequiredBudgetFields(budget);

        if (hasDuplicateName(budget.getName(), user.getId())) {
            throw new BadRequestException("A budget with this name already exists");
        }

        budget.setId(null);
        budget.setUser(user);
        budget.setCurrency(normalizeCurrency(budget.getCurrency()));
        budget.setActive(budget.getActive() == null ? Boolean.TRUE : budget.getActive());
        budget.setIsOverBudget(Boolean.FALSE);

        Budget saved = budgetRepo.save(budget);
        recalculateBudget(saved.getId());

        return getBudgetById(saved.getId(), user);
    }

    @Override
    public Budget updateBudget(Long id, Budget request, User user) {
        validateUser(user);

        if (request == null) {
            throw new BadRequestException("Budget details are required");
        }

        Budget existing = getBudgetById(id, user);

        if (request.getName() != null) {
            String newName = request.getName().trim();
            if (newName.isBlank()) {
                throw new BadRequestException("Budget name cannot be blank");
            }
            if (!newName.equalsIgnoreCase(existing.getName())
                    && hasDuplicateName(newName, user.getId())) {
                throw new BadRequestException("A budget with this name already exists");
            }
            existing.setName(newName);
        }

        if (request.getTarget() != null) {
            existing.setTarget(request.getTarget());
        }
        if (request.getCurrency() != null) {
            existing.setCurrency(normalizeCurrency(request.getCurrency()));
        }
        if (request.getCategory() != null) {
            existing.setCategory(request.getCategory());
        }
        if (request.getPeriod() != null) {
            existing.setPeriod(request.getPeriod());
        }
        if (request.getStartDate() != null) {
            existing.setStartDate(request.getStartDate());
        }
        if (request.getEndDate() != null) {
            existing.setEndDate(request.getEndDate());
        }
        if (request.getActive() != null) {
            existing.setActive(request.getActive());
        }

        validateRequiredBudgetFields(existing);

        Budget saved = budgetRepo.save(existing);
        recalculateBudget(saved.getId());

        return getBudgetById(saved.getId(), user);
    }

    @Override
    public void deleteBudget(Long id, User user) {
        Budget budget = getBudgetById(id, user);
        budgetRepo.delete(budget);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Budget> getAllBudgets(User user) {
        validateUser(user);
        return budgetRepo.findAllByUserIdOrderByStartDateDesc(user.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public Budget getBudgetById(Long id, User user) {
        validateUser(user);

        return budgetRepo.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public BudgetSummary getBudgetSummary(Long id, User user) {
        Budget budget = getBudgetById(id, user);
        BigDecimal spent = calculateSpent(budget);
        BigDecimal remaining = budget.getTarget().subtract(spent);

        double percentageUsed = spent.multiply(BigDecimal.valueOf(100))
                .divide(budget.getTarget(), 2, RoundingMode.HALF_UP)
                .doubleValue();

        return BudgetSummary.builder()
                .budgetId(budget.getId())
                .name(budget.getName())
                .category(budget.getCategory().name())
                .currency(budget.getCurrency())
                .target(budget.getTarget())
                .spent(spent)
                .remaining(remaining)
                .percentageUsed(percentageUsed)
                .isOverBudget(spent.compareTo(budget.getTarget()) > 0)
                .isExpired(budget.getEndDate().isBefore(LocalDate.now()))
                .startDate(budget.getStartDate())
                .endDate(budget.getEndDate())
                .build();
    }

    @Override
    public void recalculateBudget(Long budgetId) {
        Budget budget = budgetRepo.findById(budgetId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        BigDecimal spent = calculateSpent(budget);
        budget.setIsOverBudget(spent.compareTo(budget.getTarget()) > 0);
        budgetRepo.save(budget);
    }

    @Override
    public void recalculateUserBudgets(User user) {
        validateUser(user);

        // Recalculate all budgets, including inactive historical budgets.
        // A backdated transaction can affect a historical budget.
        List<Budget> budgets = budgetRepo.findAllByUserId(user.getId());
        for (Budget budget : budgets) {
            BigDecimal spent = calculateSpent(budget);
            budget.setIsOverBudget(spent.compareTo(budget.getTarget()) > 0);
        }
        budgetRepo.saveAll(budgets);
    }

    private BigDecimal calculateSpent(Budget budget) {
        TransactionCategory transactionCategory = null;

        if (budget.getCategory() != BudgetCategory.OVERALL) {
            transactionCategory =
                    TransactionCategory.valueOf(budget.getCategory().name());
        }

        return transactionRepo.calculateBudgetExpenses(
                budget.getUser().getId(),
                EXPENSE_TYPES,
                transactionCategory,
                budget.getStartDate(),
                budget.getEndDate(),
                budget.getCurrency()
        );
    }

    private void validateRequiredBudgetFields(Budget budget) {
        if (budget.getTarget() == null || budget.getTarget().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Budget target must be greater than zero");
        }
        if (budget.getCategory() == null) {
            throw new BadRequestException("Budget category is required");
        }
        if (budget.getPeriod() == null) {
            throw new BadRequestException("Budget period is required");
        }
        if (budget.getStartDate() == null || budget.getEndDate() == null) {
            throw new BadRequestException("Budget start date and end date are required");
        }
        if (budget.getEndDate().isBefore(budget.getStartDate())) {
            throw new BadRequestException("Budget end date cannot be before its start date");
        }
        normalizeCurrency(budget.getCurrency());
    }

    private String normalizeCurrency(String currency) {
        if (currency == null || currency.trim().length() != 3) {
            throw new BadRequestException("Currency must be a 3-letter currency code");
        }
        return currency.trim().toUpperCase(Locale.ROOT);
    }

    private boolean hasDuplicateName(String name, Long userId) {
        return name != null && !name.isBlank()
                && budgetRepo.existsByUserIdAndNameIgnoreCase(userId,name.trim());
    }

    private void validateUser(User user) {
        if (user == null || user.getId() == null) {
            throw new BadRequestException("Authenticated user is required");
        }
    }
}
