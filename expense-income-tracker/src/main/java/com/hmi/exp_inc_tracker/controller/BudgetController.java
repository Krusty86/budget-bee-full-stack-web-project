package com.hmi.exp_inc_tracker.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hmi.exp_inc_tracker.entity.Budget;
import com.hmi.exp_inc_tracker.entity.User;
import com.hmi.exp_inc_tracker.service.BudgetService;
import com.hmi.exp_inc_tracker.util.AuthenticatedUserService;
import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/budget")
@RequiredArgsConstructor
public class BudgetController {
    private final BudgetService service;
    private final AuthenticatedUserService authService;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Budget budget) {
        User user = authService.getCurrentUser();
        Budget saved = service.createBudget(budget, user);
        if (saved != null) return ResponseEntity.status(HttpStatus.OK).body(saved);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Create Budget"));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody Budget budget) {
        User user = authService.getCurrentUser();
        Budget updated = service.updateBudget(id, budget, user);
        if (updated != null) return ResponseEntity.status(HttpStatus.OK).body(updated);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Update Budget"));
    }

    @GetMapping("/getall")
    public ResponseEntity<?> getAll() {
        User user = authService.getCurrentUser();
        List<Budget> budgets = service.getAllBudgets(user);
        if (budgets != null) return ResponseEntity.status(HttpStatus.OK).body(budgets);
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(Map.of("msg", "Failed To Get Budgets"));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<?> getOne(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(service.getBudgetById(id, user));
    }

    @GetMapping("/summary/{id}")
    public ResponseEntity<?> getSummary(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(service.getBudgetSummary(id, user));
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        User user = authService.getCurrentUser();
        service.deleteBudget(id, user);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("msg", "Budget Removed Successfully"));
    }
}
