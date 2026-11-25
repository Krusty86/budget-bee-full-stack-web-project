package com.hmi.exp_inc_tracker.service;

import java.time.LocalDate;
import java.util.List;

import com.hmi.exp_inc_tracker.entity.Transaction;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.enums.TransactionCategory;
import com.hmi.exp_inc_tracker.enums.TransactionType;

public interface TransactionService {

    Transaction createTransaction(Transaction transaction, User user);

    Transaction updateTransaction(Long id, Transaction transaction, User user);

    void deleteTransaction(Long id, User user);

    Transaction getTransaction(Long id, User user);

    List<Transaction> getAllTransactions(User user);

    List<Transaction> getTransactionsByCategory(
            TransactionCategory category, User user);

    List<Transaction> getTransactionsByType(
            TransactionType type, User user);

    List<Transaction> getTransactionsByDateRange(
            LocalDate startDate, LocalDate endDate, User user);
}
