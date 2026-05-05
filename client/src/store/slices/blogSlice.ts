import {
    createSlice,
    createAsyncThunk,
    type PayloadAction,
    type UnknownAction
} from "@reduxjs/toolkit";
import axios from "axios";

/** --- TYPES --- **/

export interface Blog {
    id: string;
    title: string;
    content: string;
    image?: string;
    published: boolean;
    authorId: string;
    author: {
        username: string;
        avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface BlogState {
    blogs: Blog[];
    userBlogs: Blog[];
    currentBlog: Blog | null;
    loading: boolean;
    error: string | null;
}

const API_URL = "http://localhost:3000/posts";

/** --- HELPER --- **/

const getErrorMessage = (error: unknown, defaultMsg: string): string => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.message || defaultMsg;
    }
    return error instanceof Error ? error.message : defaultMsg;
};

/** --- ASYNC THUNKS --- **/

export const fetchBlogs = createAsyncThunk<Blog[]>("blogs/fetchBlogs", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/blogs`);
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Failed to fetch blogs"));
    }
});

export const createBlog = createAsyncThunk<Blog, { title: string; content: string; image?: string; published?: boolean }>(
    "blogs/createBlog",
    async (blogData, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { auth: { token: string | null } };
            const response = await axios.post(`${API_URL}/blogs`, blogData, {
                headers: { Authorization: `Bearer ${state.auth.token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to create blog"));
        }
    }
);

export const fetchUserBlogs = createAsyncThunk<Blog[]>("blogs/fetchUserBlogs", async (_, { rejectWithValue, getState }) => {
    try {
        const state = getState() as { auth: { token: string | null } };
        const token = state.auth.token;
        if (!token) throw new Error("Authentication token missing");
        const response = await axios.get(`${API_URL}/blogs/user`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Failed to fetch your blogs"));
    }
});

export const fetchBlogById = createAsyncThunk<Blog, string>("blogs/fetchBlogById", async (blogId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/blogs/${blogId}`);
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Failed to load blog post"));
    }
});

export const updateBlog = createAsyncThunk<Blog, { blogId: string; blogData: Partial<Blog> }>(
    "blogs/updateBlog",
    async ({ blogId, blogData }, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { auth: { token: string | null } };
            const response = await axios.put(`${API_URL}/blogs/${blogId}`, blogData, {
                headers: { Authorization: `Bearer ${state.auth.token}` }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to update blog"));
        }
    }
);

export const deleteBlog = createAsyncThunk<string, string>(
    "blogs/deleteBlog",
    async (blogId, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { auth: { token: string | null } };
            await axios.delete(`${API_URL}/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${state.auth.token}` }
            });
            return blogId;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to delete blog"));
        }
    }
);

/** --- SLICE --- **/

const initialState: BlogState = {
    blogs: [],
    userBlogs: [],
    currentBlog: null,
    loading: false,
    error: null
};

const blogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        setCurrentBlog: (state, action: PayloadAction<Blog | null>) => {
            state.currentBlog = action.payload;
        },
        clearBlogError: (state) => {
            state.error = null;
        },
        clearCurrentBlog: (state) => {
            state.currentBlog = null;
        }
    },
    extraReducers: (builder) => {
        builder
            /* Success Cases */
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.blogs = action.payload;
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.blogs.unshift(action.payload);
                state.userBlogs.unshift(action.payload);
            })
            .addCase(fetchUserBlogs.fulfilled, (state, action) => {
                state.userBlogs = action.payload;
            })
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.currentBlog = action.payload;
            })
            .addCase(updateBlog.fulfilled, (state, action) => {
                const updatedBlog = action.payload;
                if (state.currentBlog?.id === updatedBlog.id) state.currentBlog = updatedBlog;

                const updateInList = (list: Blog[]) => {
                    const index = list.findIndex(b => b.id === updatedBlog.id);
                    if (index !== -1) list[index] = updatedBlog;
                };
                updateInList(state.blogs);
                updateInList(state.userBlogs);
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                const deletedId = action.payload;
                state.blogs = state.blogs.filter(b => b.id !== deletedId);
                state.userBlogs = state.userBlogs.filter(b => b.id !== deletedId);
                if (state.currentBlog?.id === deletedId) state.currentBlog = null;
            })

            /**
             * Global Matchers: These fix the "implicit any" error by
             * explicitly typing the action as UnknownAction.
             **/
            .addMatcher(
                (action: UnknownAction) => action.type.startsWith('blogs/') && action.type.endsWith('/pending'),
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addMatcher(
                (action: UnknownAction) => action.type.startsWith('blogs/') && (action.type.endsWith('/fulfilled') || action.type.endsWith('/rejected')),
                (state, action: UnknownAction) => {
                    state.loading = false;
                    if (action.type.endsWith('/rejected')) {
                        state.error = (action.payload as string) || "An unexpected error occurred";
                    }
                }
            );
    }
});

export const { setCurrentBlog, clearBlogError, clearCurrentBlog } = blogSlice.actions;
export default blogSlice.reducer;