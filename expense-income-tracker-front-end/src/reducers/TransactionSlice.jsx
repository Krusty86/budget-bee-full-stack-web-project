import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/transactionAPI";

const errorMessage = (error) =>
  error.response?.data?.msg ||
  error.response?.data ||
  error.message ||
  "Transaction request failed";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const r = await api.getAllTransactions();
      return r.data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const fetchTransaction = createAsyncThunk(
  "transactions/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      return (await api.getTransaction(id)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const addTransaction = createAsyncThunk(
  "transactions/create",
  async (data, { rejectWithValue }) => {
    try {
      return (await api.createTransaction(data)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const editTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, transaction }, { rejectWithValue }) => {
    try {
      return (await api.updateTransaction(id, transaction)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.removeTransaction(id);
      return id;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const filterTransactionsByCategory = createAsyncThunk(
  "transactions/byCategory",
  async (category, { rejectWithValue }) => {
    try {
      return (await api.getTransactionsByCategory(category)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const filterTransactionsByType = createAsyncThunk(
  "transactions/byType",
  async (type, { rejectWithValue }) => {
    try {
      return (await api.getTransactionsByType(type)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const filterTransactionsByDateRange = createAsyncThunk(
  "transactions/byDateRange",
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      return (await api.getTransactionsByDateRange(startDate, endDate)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: { items: [], selected: null, loading: false, error: null },
  reducers: {
    clearSelectedTransaction: (state) => {
      state.selected = null;
    },
    clearTransactionError: (state) => {
      state.error = null;
    },
    resetTransactionFilters: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    };
    builder
      .addCase(fetchTransactions.pending, pending)
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchTransactions.rejected, rejected)
      .addCase(fetchTransaction.pending, pending)
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchTransaction.rejected, rejected)
      .addCase(addTransaction.pending, pending)
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addTransaction.rejected, rejected)
      .addCase(editTransaction.pending, pending)
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((x) => (x.id === action.payload.id ? action.payload : x));
        if (state.selected?.id === action.payload.id) state.selected = action.payload;
      })
      .addCase(editTransaction.rejected, rejected)
      .addCase(deleteTransaction.pending, pending)
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((x) => x.id !== action.payload);
        if (state.selected?.id === action.payload) state.selected = null;
      })
      .addCase(deleteTransaction.rejected, rejected)
      .addMatcher(
        (action) =>
          [
            filterTransactionsByCategory,
            filterTransactionsByType,
            filterTransactionsByDateRange,
          ].some((t) => t.fulfilled.match(action)),
        (state, action) => {
          state.loading = false;
          state.items = action.payload || [];
        },
      )
      .addMatcher(
        (action) =>
          [
            filterTransactionsByCategory,
            filterTransactionsByType,
            filterTransactionsByDateRange,
          ].some((t) => t.pending.match(action)),
        pending,
      )
      .addMatcher(
        (action) =>
          [
            filterTransactionsByCategory,
            filterTransactionsByType,
            filterTransactionsByDateRange,
          ].some((t) => t.rejected.match(action)),
        rejected,
      );
  },
});
export const {
  clearSelectedTransaction,
  clearTransactionError,
  resetTransactionFilters,
} = transactionSlice.actions;
export default transactionSlice.reducer;
