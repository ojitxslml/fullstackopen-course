import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import blogService from "../services/blogs";

const initialState = {
  allBlogs: [], // Aquí se almacenan todos los blogs
  blogById: null, // Para almacenar el blog individual seleccionado
  status: 'idle', // para gestionar el estado de las peticiones async
  error: null, // para manejar errores
};

export const fetchBlogs = createAsyncThunk("blogs/fetchBlogs", async () => {
  const blogs = await blogService.getAll();
  return blogs;
});

export const fetchBlogById = createAsyncThunk("blogs/fetchBlogById", async (id) => {
  const blog = await blogService.getById(id);
  return blog;
});

export const addBlog = createAsyncThunk("blogs/addBlog", async (newBlog, { dispatch }) => {
  const createdBlog = await blogService.create(newBlog);
  dispatch(fetchBlogs());
  return createdBlog;
});

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

export const addComment = createAsyncThunk("blogs/addComment", async ({ blogId, content }) => {
  const updatedBlog = await blogService.addComment(blogId, content);
  return updatedBlog;
});

const blogsSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.allBlogs = action.payload;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.blogById = action.payload;
      })
      .addCase(addBlog.fulfilled, (state, action) => {
        state.allBlogs.push(action.payload);
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const likedBlog = action.payload;
        state.allBlogs = state.allBlogs.map((blog) =>
          blog.id === likedBlog.id ? { ...blog, likes: likedBlog.likes } : blog
        );
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        const id = action.payload;
        state.allBlogs = state.allBlogs.filter((blog) => blog.id !== id);
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedBlog = action.payload;
        state.allBlogs = state.allBlogs.map((blog) =>
          blog.id === updatedBlog.id ? updatedBlog : blog
        );
        if (state.blogById && state.blogById.id === updatedBlog.id) {
          state.blogById = updatedBlog;
        }
      });
  },
});

export default blogsSlice.reducer;
