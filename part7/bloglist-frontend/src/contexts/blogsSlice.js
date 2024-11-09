import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const blogs = await blogService.getAll();
  return blogs;
});

export const addBlog = createAsyncThunk(
  "blogs/addBlog",
  async (newBlog, { dispatch }) => {
    const createdBlog = await blogService.create(newBlog);
    dispatch(fetchBlogs());
    return createdBlog;
  }
);

export const likeBlog = createAsyncThunk("blogs/likeBlog", async (id) => {
  const blog = await blogService.getById(id);
  const updatedBlog = { ...blog, likes: blog.likes + 1 };
  const response = await blogService.update(id, updatedBlog);
  return response;
});

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  await blogService.remove(id);
  return id;
});

const blogsSlice = createSlice({
  name: "blogs",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => action.payload)
      .addCase(addBlog.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const likedBlog = action.payload;
        return state.map((blog) =>
          blog.id === likedBlog.id ? { ...blog, likes: likedBlog.likes } : blog
        );
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const id = action.payload;
        return state.filter((blog) => blog.id !== id);
      });
  },
});

export default blogsSlice.reducer;
