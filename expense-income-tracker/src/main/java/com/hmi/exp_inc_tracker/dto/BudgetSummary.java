package com.hmi.exp_inc_tracker.dto;
import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetSummary {

    private Long budgetId;
    private String name;
    private String category;
    private String currency;

    private BigDecimal target;
    private BigDecimal spent;
    private BigDecimal remaining;

    private Double percentageUsed;

    private Boolean isOverBudget;
    private Boolean isExpired;

    private LocalDate startDate;
    private LocalDate endDate;
}