export const selectSubscriptions = (state) => state.subscriptions.items;
export const selectSelectedSubscription = (state) => state.subscriptions.selected;
export const selectSubscriptionLoading = (state) => state.subscriptions.loading;
export const selectSubscriptionError = (state) => state.subscriptions.error;
export const selectActiveSubscriptions = (state) => state.subscriptions.items.filter(s => s.status === "ACTIVE");
export const selectPausedSubscriptions = (state) => state.subscriptions.items.filter(s => s.status === "PAUSED");
export const selectCancelledSubscriptions = (state) => state.subscriptions.items.filter(s => s.status === "CANCELLED");
export const selectUpcomingSubscriptions = (state, today = new Date().toISOString().slice(0,10)) =>
  state.subscriptions.items.filter(s => s.status === "ACTIVE" && s.nextPaymentDate >= today).sort((a,b) => a.nextPaymentDate.localeCompare(b.nextPaymentDate));
