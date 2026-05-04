import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Assuming your store file exports this type
// import { RootState } from "../store"; 

interface Blog {
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

const API_URL = "http://localhost:3000";

// Helper for error messages
const getErrorMessage = (error: unknown, defaultMsg: string) =>
    (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || (error as { message?: string }).message || defaultMsg;

export const fetchBlogs = createAsyncThunk<Blog[]>("blogs/fetchBlogs", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/blogs`);
        return response.data;
    } catch (error) {
        return rejectWithValue(getErrorMessage(error, "Failed to fetch blogs"));
    }
});

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
            const token = state.auth.token;
            const response = await axios.put(`${API_URL}/blogs/${blogId}`, blogData, {
                headers: { Authorization: `Bearer ${token}` }
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
            const token = state.auth.token;
            await axios.delete(`${API_URL}/blogs/${blogId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return blogId;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error, "Failed to delete blog"));
        }
    }
);

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
        }
    },
    extraReducers: (builder) => {
        builder
            /* Fetch All Blogs */
            .addCase(fetchBlogs.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.blogs = action.payload;
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            /* Fetch User Blogs */
            .addCase(fetchUserBlogs.fulfilled, (state, action) => {
                state.loading = false;
                state.userBlogs = action.payload;
            })

            /* Fetch Blog By ID */
            .addCase(fetchBlogById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentBlog = action.payload;
            })

            /* Update Blog */
            .addCase(updateBlog.fulfilled, (state, action) => {
                state.loading = false;
                const updatedBlog = action.payload;

                // Update currentBlog if it's the one being edited
                if (state.currentBlog?.id === updatedBlog.id) {
                    state.currentBlog = updatedBlog;
                }

                // Update in list arrays to avoid re-fetching
                const updateInList = (list: Blog[]) => {
                    const index = list.findIndex(b => b.id === updatedBlog.id);
                    if (index !== -1) list[index] = updatedBlog;
                };

                updateInList(state.blogs);
                updateInList(state.userBlogs);
            })

            /* Delete Blog */
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.loading = false;
                const deletedId = action.payload;

                state.blogs = state.blogs.filter(b => b.id !== deletedId);
                state.userBlogs = state.userBlogs.filter(b => b.id !== deletedId);

                if (state.currentBlog?.id === deletedId) {
                    state.currentBlog = null;
                }
            });
    }
});

export const { setCurrentBlog, clearBlogError } = blogSlice.actions;
export default blogSlice.reducer;

// import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// interface Blog {
//   id: string;
//   title: string;
//   content: string;
//   image?: string;
//   published: boolean;
//   authorId: string;
//   author: {
//     username: string;
//     avatar?: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// interface BlogState {
//   blogs: Blog[];
//   userBlogs: Blog[];
//   currentBlog: Blog | null;
//   loading: boolean;
//   error: string | null;
// }

// const API_URL = "http://localhost:3000";

// export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async (_, { rejectWithValue }) => {
//     try {
//         const response = await axios.get(`${API_URL}/blogs`);
//         return response.data;
//     } catch (error: unknown) {
//         return rejectWithValue(`Failed to fetch blogs ${error instanceof Error ? error.message : "Failed to fetch blogs" }`);
//     }
// });

// export const fetchUserBlogs = createAsyncThunk("blogs/fetchUserBlogs", async (_, { rejectWithValue, getState }) => {
//     try {
//         const state = getState() as { auth: { token: string | null } };
//         const token = state.auth.token;
//         if (!token) throw new Error("No token found");

//         const response = await axios.get(`${API_URL}/blogs/user`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         return response.data;
//     } catch (error: unknown) {
//         return rejectWithValue(`Failed to fetch user blogs ${error instanceof Error ? error.message : "Failed to fetch user blogs" }`);
//     }
// });

// export const fetchBlogById = createAsyncThunk("blogs/fetchBlogById", async (blogId: string, { rejectWithValue }) => {
//     try {
//         const response = await axios.get(`${API_URL}/blogs/${blogId}`);
//         return response.data;
//     } catch (error: unknown) {
//         return rejectWithValue(`Failed to fetch blog post ${error instanceof Error ? error.message : "Failed to fetch blog post" }`);
//     } 
// });

// export const updateBlog = createAsyncThunk("blogs/updateBlog", async ({ blogId, blogData }: { blogId: string; blogData: { title?: string; content?: string; image?: string; published?: boolean } }, { rejectWithValue, getState }) => {
//     try {
//         const state = getState() as { auth: { token: string | null } };
//         const token = state.auth.token;
//         if (!token) throw new Error("No token found");

//         const response = await axios.put(`${API_URL}/blogs/${blogId}`, blogData, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//         return response.data;
//     } catch (error: unknown) {
//         return rejectWithValue(`Failed to update blog post ${error instanceof Error ? error.message : "Failed to update blog post" }`);
//     }
// });

// export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (blogId: string, { rejectWithValue, getState }) => {
//     try {
//         const state = getState() as { auth: { token: string | null } };
//         const token = state.auth.token;
//         if (!token) throw new Error("No token found");

//         await axios.delete(`${API_URL}/blogs/${blogId}`, {
//             headers: { Authorization: `Bearer ${token}` }
//         });
//     } catch (error: unknown) {
//         return rejectWithValue(`Failed to delete blog post ${error instanceof Error ? error.message : "Failed to delete blog post" }`);
//     }
// });

// const blogSlice = createSlice({
//     name: "blogs",
//     initialState: {
//         blogs: [],
//         userBlogs: [],
//         currentBlog: null,
//         loading: false,
//         error: null
//     } as BlogState,
//     reducers: {
//         setCurrentBlog: (state, action: PayloadAction<Blog | null>) => {
//             state.currentBlog = action.payload;
//         }
//     },
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchBlogs.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchBlogs.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.blogs = action.payload;
//             })
//             .addCase(fetchBlogs.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string | null;
//             })
//             .addCase(fetchUserBlogs.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchUserBlogs.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.userBlogs = action.payload;
//             })
//             .addCase(fetchUserBlogs.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string | null;
//             })
//             .addCase(fetchBlogById.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(fetchBlogById.fulfilled, (state, action) => {
//                 state.loading = false;
//                 state.currentBlog = action.payload;
//             })
//             .addCase(fetchBlogById.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string | null;
//             })
//             .addCase(updateBlog.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(updateBlog.fulfilled, (state, action) => {
//                 state.loading = false;
//                 if (state.currentBlog) {
//                     state.currentBlog = { ...state.currentBlog, ...action.payload };
//                 }
//             })
//             .addCase(updateBlog.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string | null;
//             })
//             .addCase(deleteBlog.pending, (state) => {
//                 state.loading = true;
//                 state.error = null;
//             })
//             .addCase(deleteBlog.fulfilled, (state) => {
//                 state.loading = false;
//                 if (state.currentBlog) {
//                     const blogIndex = state.userBlogs.findIndex((blog) => blog.id === state.currentBlog?.id);
//                     if (blogIndex !== -1) {
//                         state.userBlogs.splice(blogIndex, 1);
//                     }
//                     state.currentBlog = null;
//                 }
//             })
//             .addCase(deleteBlog.rejected, (state, action) => {
//                 state.loading = false;
//                 state.error = action.payload as string | null;
//             });
//     }
// });

// export const { setCurrentBlog } = blogSlice.actions;
// export default blogSlice.reducer;