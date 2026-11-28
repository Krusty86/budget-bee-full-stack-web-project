import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authAPI from "../api/authAPI";

// Helper for handling backend errors
const getApiError = (error, fallback) => {
  return error.response?.data || fallback;
};

// Login
export const userLogin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.post("/api/auth/login", credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error, "Login failed"));
    }
  },
);

// Register
export const userRegister = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.post("/api/auth/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error, "Registration failed"));
    }
  },
);

// Request Password Reset OTP
export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.post("/api/auth/pwd-reset-request", null, {
        params: { email },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error, "Failed to request OTP."));
    }
  },
);

// Reset Password
export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await authAPI.post("/api/auth/pwd-reset", {
        email: passwordData.email,
        code: passwordData.code,
        newPwd: passwordData.newPwd,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(getApiError(error, "Failed to reset password."));
    }
  },
);

const AuthSlice = createSlice({
  name: "auth",

  initialState: {
    userId: localStorage.getItem("userId") || null,
    userToken: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
    fullname: localStorage.getItem("fullname") || null,
    successMessage: null,
    error: null,
    loading: false,
    registerSuccess: false,

    // Password Reset States
    passwordResetRequestLoading: false,
    passwordResetRequestSuccess: false,

    passwordResetLoading: false,
    passwordResetSuccess: false,

    passwordResetError: null,
  },

  reducers: {
    logout: (state) => {
      state.userId = null;
      state.userToken = null;
      state.username = null;
      state.fullname = null;

      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("fullname");
    },

    resetRegisterStatus: (state) => {
      state.registerSuccess = false;
      state.error = null;
      state.successMessage = null;
      state.loading = false;
    },

    clearPasswordResetState: (state) => {
      state.passwordResetRequestLoading = false;
      state.passwordResetRequestSuccess = false;
      state.passwordResetLoading = false;
      state.passwordResetSuccess = false;
      state.passwordResetError = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.successMessage =
          action.payload.msg || "Login successful! Welcome back.";

        const user = action.payload.user;

        const username = user.userName;
        const fullname = user.fullName;

        state.userId = action.payload.userId;
        state.userToken = action.payload.token;
        state.username = username;
        state.fullname = fullname;

        localStorage.setItem("userId", action.payload.userId);
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("username", username);
        localStorage.setItem("fullname", fullname);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.successMessage = null;

        const error = action.payload;

        state.error =
          typeof error === "string"
            ? error
            : error?.msg ||
              error?.message ||
              error?.error ||
              "Login failed. Please try again.";
      })

      // REGISTER
      .addCase(userRegister.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
        state.registerSuccess = false;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.registerSuccess = true;
        state.successMessage =
          action.payload?.msg || "Your account has been created successfully!";
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.loading = false;
        state.registerSuccess = false;

        const error = action.payload;

        state.error =
          typeof error === "string"
            ? error
            : error?.msg ||
              error?.message ||
              error?.error ||
              "Registration failed. Please try again.";
      })

      // REQUEST PASSWORD RESET OTP
      .addCase(requestPasswordReset.pending, (state) => {
        state.passwordResetRequestLoading = true;
        state.passwordResetRequestSuccess = false;
        state.passwordResetError = null;
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.passwordResetRequestLoading = false;
        state.passwordResetRequestSuccess = true;
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.passwordResetRequestLoading = false;
        state.passwordResetRequestSuccess = false;
        state.passwordResetError = action.payload;
      })

      // RESET PASSWORD
      .addCase(resetPassword.pending, (state) => {
        state.passwordResetLoading = true;
        state.passwordResetSuccess = false;
        state.passwordResetError = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.passwordResetLoading = false;
        state.passwordResetSuccess = true;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordResetLoading = false;
        state.passwordResetSuccess = false;
        state.passwordResetError = action.payload;
      });
  },
});

export const { logout, resetRegisterStatus, clearPasswordResetState } =
  AuthSlice.actions;

export default AuthSlice.reducer;
