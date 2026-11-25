package com.hmi.exp_inc_tracker.util;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.hmi.exp_inc_tracker.entity.Budget;
import com.hmi.exp_inc_tracker.repository.BudgetRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BudgetScheduler {

    private final BudgetRepository budgetRepo;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void closeExpiredBudgets() {

        List<Budget> expiredBudgets =
                budgetRepo.findAllByActiveTrueAndEndDateBefore(
                        LocalDate.now()
                );

        for (Budget budget : expiredBudgets) {

            budget.setActive(false);

            budgetRepo.save(budget);
        }
    }
}
