package com.hmi.exp_inc_tracker.service;

import java.util.List;

import com.hmi.exp_inc_tracker.dto.BudgetSummary;
import com.hmi.exp_inc_tracker.entity.Budget;
import com.hmi.exp_inc_tracker.entity.User;

public interface BudgetService {
	Budget createBudget(Budget budget, User user);

    Budget updateBudget(Long id, Budget budget, User user);

    void deleteBudget(Long id, User user);

    List<Budget> getAllBudgets(User user);

    Budget getBudgetById(Long id, User user);

    BudgetSummary getBudgetSummary(Long id, User user);

    void recalculateBudget(Long budgetId);

    void recalculateUserBudgets(User user);
}
