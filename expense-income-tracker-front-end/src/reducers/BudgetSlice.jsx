import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/budgetAPI";

const errorMessage = (error) =>
  error.response?.data?.msg ||
  error.response?.data ||
  error.message ||
  "Budget request failed";
export const fetchBudgets = createAsyncThunk(
  "budgets/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return (await api.getAllBudgets()).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const fetchBudget = createAsyncThunk(
  "budgets/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return (await api.getBudget(id)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const fetchBudgetSummary = createAsyncThunk(
  "budgets/fetchSummary",
  async (id, { rejectWithValue }) => {
    try {
      return { id, summary: (await api.getBudgetSummary(id)).data };
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const addBudget = createAsyncThunk(
  "budgets/create",
  async (budget, { rejectWithValue }) => {
    try {
      return (await api.createBudget(budget)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const editBudget = createAsyncThunk(
  "budgets/update",
  async ({ id, budget }, { rejectWithValue }) => {
    try {
      return (await api.updateBudget(id, budget)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const deleteBudget = createAsyncThunk(
  "budgets/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.removeBudget(id);
      return id;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);

const slice = createSlice({
  name: "budgets",
  initialState: {
    items: [],
    selected: null,
    summaries: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearBudgetError: (state) => {
      state.error = null;
    },
    clearSelectedBudget: (state) => {
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
    builder.addCase(fetchBudgets.pending, pending)
      .addCase(fetchBudgets.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchBudgets.rejected, rejected)
      .addCase(fetchBudget.pending, pending)
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchBudget.rejected, rejected)
      .addCase(fetchBudgetSummary.pending, pending)
      .addCase(fetchBudgetSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.summaries[action.payload.id] = action.payload.summary;
      })
      .addCase(fetchBudgetSummary.rejected, rejected)
      .addCase(addBudget.pending, pending)
      .addCase(addBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addBudget.rejected, rejected)
      .addCase(editBudget.pending, pending)
      .addCase(editBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((x) => (x.id === action.payload.id ? action.payload : x));
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(editBudget.rejected, rejected)
      .addCase(deleteBudget.pending, pending)
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((x) => x.id !== action.payload);
        delete state.summaries[action.payload];
      })
      .addCase(deleteBudget.rejected, rejected);
  },
});
export const { clearBudgetError, clearSelectedBudget } = slice.actions;
export default slice.reducer;
