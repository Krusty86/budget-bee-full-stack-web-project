package com.hmi.exp_inc_tracker.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hmi.exp_inc_tracker.entity.Transaction;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.enums.TransactionCategory;
import com.hmi.exp_inc_tracker.enums.TransactionType;
import com.hmi.exp_inc_tracker.service.TransactionService;
import com.hmi.exp_inc_tracker.util.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;
    private final AuthenticatedUserService authService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Transaction transaction) {
        User user = authService.getCurrentUser();
        Transaction saved = service.createTransaction(transaction, user);
        if (saved != null) return ResponseEntity.status(HttpStatus.OK).body(saved);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Create Transaction"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Transaction transaction) {
        User user = authService.getCurrentUser();
        Transaction updated = service.updateTransaction(id, transaction, user);
        if (updated != null) return ResponseEntity.status(HttpStatus.OK).body(updated);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Update Transaction"));
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAll() {
        User user = authService.getCurrentUser();
        List<Transaction> transactions = service.getAllTransactions(user);
        if (transactions != null) return ResponseEntity.status(HttpStatus.OK).body(transactions);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Get Transactions"));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        Transaction transaction = service.getTransaction(id, user);
        if (transaction != null) return ResponseEntity.status(HttpStatus.OK).body(transaction);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("msg", "Transaction Not Found"));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<?> getByCategory(@PathVariable TransactionCategory category) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(service.getTransactionsByCategory(category, user));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> getByType(@PathVariable TransactionType type) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(service.getTransactionsByType(type, user));
    }

    @GetMapping("/date-range")
    public ResponseEntity<?> getByDateRange(@RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(service.getTransactionsByDateRange(startDate, endDate, user));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        service.deleteTransaction(id, user);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Transaction Removed Successfully"));
    }
}
