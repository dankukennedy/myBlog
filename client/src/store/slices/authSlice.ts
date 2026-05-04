import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const API_URL = "http://localhost:3000";

// Helper for error handling
const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || "An error occurred";
    }
    return "An unexpected error occurred";
};

export const register = createAsyncThunk(
    "auth/register",
    async (userData: { username: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            return response.data; // Expecting { token: string, user: User }
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const login = createAsyncThunk(
    "auth/login",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, credentials);
            return response.data; // Expecting { token: string, user: User }
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (profileData: { username?: string; avatar?: string; bio?: string }, { getState, rejectWithValue }) => {
        try {
            const state = getState() as { auth: AuthState };
            const token = state.auth.token;
            if (!token) throw new Error("No token found");

            const response = await axios.put(`${API_URL}/users/profile`, profileData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data; // Expecting { user: User }
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
);

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("user") || "null"),
    token: localStorage.getItem("token"),
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        }
    },
    extraReducers: (builder) => {
        // REGISTER & LOGIN (Shared logic)
        [register, login].forEach((thunk) => {
            builder.addCase(thunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            });
            builder.addCase(thunk.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            });
            builder.addCase(thunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
        });

        // UPDATE PROFILE
        builder.addCase(updateProfile.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
            state.loading = false;
            state.user = action.payload.user;
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        });
        builder.addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const { logout, loginSuccess } = authSlice.actions;
export default authSlice.reducer;


// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// interface User {
//  id:string;
//  username: string;
//  email: string;
//  avatar?: string;
//  bio?: string;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   loading: boolean;
//   error: string | null;
// }

// const API_URL: string = "http://localhost:3000";

//  export const register = createAsyncThunk(
//   "auth/register",
//   async (userData: { username: string; email: string; password: string }) => {
//     const  response = await axios.post(`${API_URL}/auth/register`, userData);
//     if(response.data.token){
//       localStorage.setItem("token", response.data.token);
//     }
//     return response.data;
//   }
// );

// export const login = createAsyncThunk(
//   "auth/login",
//   async (credentials: { email: string; password: string }) => {
//     const response = await axios.post(`${API_URL}/auth/login`, credentials);
//     if(response.data.token){
//       localStorage.setItem("token", response.data.token);
//     }
//     return response.data;
//   }
// );

// export const logoutUser = createAsyncThunk("auth/logout", async () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");
// });

// export const updateProfile = createAsyncThunk(
//   "auth/updateProfile",
//   async (profileData: { username?: string; avatar?: string; bio?: string }, { getState }) => {
//     const state = getState() as { auth: AuthState };
//     const token = state.auth.token;
//     if (!token) throw new Error("No token found");
//     const response = await axios.put(`${API_URL}/users/profile`, profileData, {
//       headers: { Authorization: `Bearer ${token}` }
//     });
//     return response.data;
//   }
//  );

//  const  authSlice = createSlice({
//   name: "auth",
//   initialState:{
//     user:JSON.parse(localStorage.getItem("user") || "null"),
//     token:localStorage.getItem("token"),
//     loading:false,
//     error:null,
//   } as AuthState,
//     reducers:{
//         logout:(state) => {
//             state.user = null;
//             state.token = null;
//             localStorage.removeItem("token");
//             localStorage.removeItem("user");
//         },
//         loginSuccess:(state, action: PayloadAction<{ token: string; user: User }>) => {
//             state.token = action.payload.token;
//             state.user = action.payload.user;
//             localStorage.setItem("token", action.payload.token);
//             localStorage.setItem("user", JSON.stringify(action.payload.user));
//         }
//     },

//     extraReducers:(builder) => {
//         builder.addCase(register.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         });
//         builder.addCase(register.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
//             state.loading = false;
//             state.token = action.payload.token;
//             state.user = action.payload.user;
//             localStorage.setItem("user", JSON.stringify(action.payload.user));
//         });
//         builder.addCase(register.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.error.message || "Registration failed";
//         });

//         builder.addCase(login.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         });
//         builder.addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
//             state.loading = false;
//             state.token = action.payload.token;
//             state.user = action.payload.user;
//             localStorage.setItem("user", JSON.stringify(action.payload.user));
//         });
//         builder.addCase(login.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.error.message || "Login failed";
//         });
//         builder.addCase(updateProfile.pending, (state) => {
//             state.loading = true;
//             state.error = null;
//         });
//         builder.addCase(updateProfile.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
//             state.loading = false;
//             state.user = action.payload.user;
//             localStorage.setItem("user", JSON.stringify(action.payload.user));
//         });
//         builder.addCase(updateProfile.rejected, (state, action) => {
//             state.loading = false;
//             state.error = action.error.message || "Profile update failed";
//         });
//     }
// });

// export const { logout , loginSuccess} = authSlice.actions;
// export default authSlice.reducer;