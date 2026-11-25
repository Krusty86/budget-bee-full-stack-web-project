export const selectTransactions = (state) => state.transactions.items;
export const selectSelectedTransaction = (state) => state.transactions.selected;
export const selectTransactionLoading = (state) => state.transactions.loading;
export const selectTransactionError = (state) => state.transactions.error;
export const selectTransactionsByType = (state, type) => state.transactions.items.filter(t => t.transaction_type === type);
export const selectTransactionsByCategory = (state, category) => state.transactions.items.filter(t => t.category === category);
export const selectTransactionTotals = (state) => state.transactions.items.reduce((totals, t) => {
  const amount = Number(t.amount || 0);
  if (t.transaction_type === "INCOME") totals.income += amount;
  if (t.transaction_type === "EXPENSE" || t.transaction_type === "SUBSCRIPTION") totals.expense += amount;
  return totals;
}, { income: 0, expense: 0 });
