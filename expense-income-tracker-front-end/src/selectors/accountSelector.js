export const selectAccounts = state => state.accounts.items;
export const selectAccountLoading = state => state.accounts.loading;
export const selectAccountError = state => state.accounts.error;
export const selectAccountById = (state,id) => state.accounts.items.find(account => account.id === id) || null;
