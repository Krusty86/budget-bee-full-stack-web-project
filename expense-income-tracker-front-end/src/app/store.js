import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../reducers/AuthSlice";
import accountReducer from "../reducers/AccountSlice";
import budgetReducer from "../reducers/BudgetSlice";
import transactionReducer from "../reducers/TransactionSlice";
import taskListReducer from "../reducers/TaskListSlice";
import subscriptionReducer from "../reducers/SubscriptionSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    budgets: budgetReducer,
    transactions: transactionReducer,
    taskLists: taskListReducer,
    subscriptions: subscriptionReducer,
  },
});

export default store;
