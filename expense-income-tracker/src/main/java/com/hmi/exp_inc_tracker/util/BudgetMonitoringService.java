package com.hmi.exp_inc_tracker.util;

import org.springframework.stereotype.Service;

import com.hmi.exp_inc_tracker.service.BudgetService;

import lombok.RequiredArgsConstructor;

/*
 * Kept as a small facade for code that already calls BudgetMonitoringService.
 * Budget calculation logic lives in BudgetServiceImpl to avoid duplicate rules.
 */
@Service
@RequiredArgsConstructor
public class BudgetMonitoringService {

    private final BudgetService budgetService;

    public void recalculateBudget(Long budgetId) {
        budgetService.recalculateBudget(budgetId);
    }
}
