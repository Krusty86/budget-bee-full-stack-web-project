import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/accountAPI";
const errorMessage = (e) =>
  e.response?.data?.msg ||
  e.response?.data ||
  e.message ||
  "Account request failed";
export const fetchAccounts = createAsyncThunk(
  "accounts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return (await api.getAllAccounts()).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const addAccount = createAsyncThunk(
  "accounts/create",
  async (data, { rejectWithValue }) => {
    try {
      return (await api.createAccount(data)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const editAccount = createAsyncThunk(
  "accounts/update",
  async ({ id, account }, { rejectWithValue }) => {
    try {
      return (await api.updateAccount(id, account)).data;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
export const deleteAccount = createAsyncThunk(
  "accounts/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.removeAccount(id);
      return id;
    } catch (e) {
      return rejectWithValue(errorMessage(e));
    }
  },
);
const slice = createSlice({
  name: "accounts",
  initialState: { items: [], loading: false, error: null },
  reducers: {
    clearAccountError: (state) => {
      state.error = null;
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
    builder.addCase(fetchAccounts.pending, pending)
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchAccounts.rejected, rejected)
      .addCase(addAccount.pending, pending)
      .addCase(addAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addAccount.rejected, rejected)
      .addCase(editAccount.pending, pending)
      .addCase(editAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((acc) => (acc.id === action.payload.id ? action.payload : acc));
      })
      .addCase(editAccount.rejected, rejected)
      .addCase(deleteAccount.pending, pending)
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((acc) => acc.id !== action.payload);
      })
      .addCase(deleteAccount.rejected, rejected);
  },
});
export const { clearAccountError } = slice.actions;
export default slice.reducer;
