
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authAPI from "../api/authAPI";

// Login
export const userLogin = createAsyncThunk(
    "auth/login",
    async (credentials, { rejectWithValue }) => {
        try {
            const response = await authAPI.post(
                "/api/auth/login",
                credentials
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Login failed"
            );
        }
    }
);

// Register
export const userRegister = createAsyncThunk(
    "auth/register",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await authAPI.post(
                "/api/auth/register",
                userData
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Registration failed"
            );
        }
    }
);


const AuthSlice = createSlice({
    name: "auth",

    initialState: {
        userId: localStorage.getItem("userId") || null,
        userToken: localStorage.getItem("token") || null,
        error: null,
        loading: false,
        registerSuccess: false
    },

    reducers: {
        logout: (state) => {
            state.userId = null;
            state.userToken = null;

            localStorage.removeItem("userId");
            localStorage.removeItem("token");
        },

        resetRegisterStatus: (state) => {
            state.registerSuccess = false;
            state.error = null;
        }
    },

    extraReducers: (builder) => {
        builder

            // LOGIN
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(userLogin.fulfilled, (state, action) => {
                state.loading = false;

                state.userId = action.payload.userId;
                state.userToken = action.payload.token;

                localStorage.setItem("userId", action.payload.userId);
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(userLogin.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // REGISTER
            .addCase(userRegister.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.registerSuccess = false;
            })
            .addCase(userRegister.fulfilled, (state) => {
                state.loading = false;
                state.registerSuccess = true;
            })
            .addCase(userRegister.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { logout, resetRegisterStatus } = AuthSlice.actions;

export default AuthSlice.reducer;
