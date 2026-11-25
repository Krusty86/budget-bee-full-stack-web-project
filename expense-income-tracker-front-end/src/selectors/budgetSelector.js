export const selectBudgets = (state) => state.budgets.items;
export const selectSelectedBudget = (state) => state.budgets.selected;
export const selectBudgetLoading = (state) => state.budgets.loading;
export const selectBudgetError = (state) => state.budgets.error;
export const selectBudgetSummaryById = (state, id) => state.budgets.summaries[id] || null;
export const selectActiveBudgets = (state) => state.budgets.items.filter(b => b.active);
