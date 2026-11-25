import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/subscriptionAPI";

const errorMessage = (e) =>
  e.response?.data?.msg ||
  e.response?.data ||
  e.message ||
  "Subscription request failed";
const thunk = (type, fn) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await fn(arg);
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  });
export const fetchSubscriptions = thunk(
  "subscriptions/fetchAll",
  async () => (await api.getAllSubscriptions()).data,
);
export const fetchSubscription = thunk(
  "subscriptions/fetchOne",
  async (id) => (await api.getSubscription(id)).data,
);
export const addSubscription = thunk(
  "subscriptions/create",
  async (data) => (await api.createSubscription(data)).data,
);
export const editSubscription = thunk(
  "subscriptions/update",
  async ({ id, subscription }) =>
    (await api.updateSubscription(id, subscription)).data,
);
export const filterSubscriptionsByStatus = thunk(
  "subscriptions/byStatus",
  async (status) => (await api.getSubscriptionsByStatus(status)).data,
);
export const pauseSubscription = thunk("subscriptions/pause", async (id) => {
  await api.pauseSubscription(id);
  return { id, status: "PAUSED" };
});
export const resumeSubscription = thunk("subscriptions/resume", async (id) => {
  await api.resumeSubscription(id);
  return { id, status: "ACTIVE" };
});
export const cancelSubscription = thunk("subscriptions/cancel", async (id) => {
  await api.cancelSubscription(id);
  return { id, status: "CANCELLED" };
});

const slice = createSlice({
  name: "subscriptions",
  initialState: { items: [], selected: null, loading: false, error: null },
  reducers: {
    clearSubscriptionError: (state) => {
      state.error = null;
    },
    clearSelectedSubscription: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
        state.loading = true;
        state.error = null;
      },
      rejected = (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      };
    builder.addCase(fetchSubscriptions.pending, pending)
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchSubscriptions.rejected, rejected)
      .addCase(fetchSubscription.pending, pending)
      .addCase(fetchSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchSubscription.rejected, rejected)
      .addCase(addSubscription.pending, pending)
      .addCase(addSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addSubscription.rejected, rejected)
      .addCase(editSubscription.pending, pending)
      .addCase(editSubscription.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((x) => (x.id === action.payload.id ? action.payload : x));
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(editSubscription.rejected, rejected)
      .addCase(filterSubscriptionsByStatus.pending, pending)
      .addCase(filterSubscriptionsByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(filterSubscriptionsByStatus.rejected, rejected)
      .addMatcher(
        (action) =>
          [pauseSubscription, resumeSubscription, cancelSubscription].some(
            (t) => t.pending.match(action),
          ),
        pending,
      )
      .addMatcher(
        (action) =>
          [pauseSubscription, resumeSubscription, cancelSubscription].some(
            (t) => t.fulfilled.match(action),
          ),
        (state, action) => {
          state.loading = false;
          state.items = state.items.map((x) =>
            x.id === action.payload.id ? { ...x, status: action.payload.status } : x,
          );
          if (state.selected?.id === action.payload.id)
            state.selected = { ...state.selected, status: action.payload.status };
        },
      )
      .addMatcher(
        (action) =>
          [pauseSubscription, resumeSubscription, cancelSubscription].some(
            (t) => t.rejected.match(action),
          ),
        rejected,
      );
  },
});
export const { clearSubscriptionError, clearSelectedSubscription } =
  slice.actions;
export default slice.reducer;
