import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as api from "../api/userAPI";

const errorMessage = (error) =>
  error.response?.data?.msg ||
  (typeof error.response?.data === "string" ? error.response.data : null) ||
  error.message ||
  "User request failed";

export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
        console.log("Inside Fetch User profile")
      return (await api.getUserProfile()).data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  "user/updateProfile",
  async (profile, { rejectWithValue }) => {
    try {
      return (await api.changeUserProfile(profile)).data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const requestPasswordOtp = createAsyncThunk(
  "user/requestPasswordOtp",
  async (_, { rejectWithValue }) => {
    try {
      return (await api.getPwdChangeOTP()).data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

export const updateUserPassword = createAsyncThunk(
  "user/updatePassword",
  async (passwordData, { rejectWithValue }) => {
    try {
        console.log(passwordData)
      return (await api.changeUserPassword(passwordData)).data;
    } catch (error) {
      return rejectWithValue(errorMessage(error));
    }
  },
);

const UserSlice = createSlice({
  name: "user",
  initialState: {
    profile: null,
    loading: false,
    updatingProfile: false,
    requestingOtp: false,
    updatingPassword: false,
    otpRequested: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearUserMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.updatingProfile = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.updatingProfile = false;
        state.profile = action.payload;
        state.successMessage = "Profile updated successfully.";
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updatingProfile = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(requestPasswordOtp.pending, (state) => {
        state.requestingOtp = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(requestPasswordOtp.fulfilled, (state) => {
        state.requestingOtp = false;
        state.otpRequested = true;
        state.successMessage = "OTP requested. Please check your email.";
      })
      .addCase(requestPasswordOtp.rejected, (state, action) => {
        state.requestingOtp = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(updateUserPassword.pending, (state) => {
        state.updatingPassword = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.updatingPassword = false;
        state.otpRequested = false;
        state.successMessage = "Password changed successfully.";
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.updatingPassword = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearUserMessages } = UserSlice.actions;
export default UserSlice.reducer;
