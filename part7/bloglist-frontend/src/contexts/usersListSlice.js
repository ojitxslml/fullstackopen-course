import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userService from "../services/users";

const initialState = {
  allUsers: [],  // Aquí se almacenan todos los usuarios
  userById: null, // Para almacenar el usuario individual
  status: 'idle', // para gestionar el estado de las peticiones async
  error: null,    // para manejar errores
};

// AsyncThunk para obtener todos los usuarios
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const users = await userService.getAll();
  return users;
});

// AsyncThunk para obtener un usuario por ID
export const fetchUserById = createAsyncThunk("users/fetchUserById", async (UserId) => {
  const user = await userService.getById(UserId);
  return user;
});

const usersListSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allUsers = action.payload;  // Guardar los usuarios en allUsers
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'; 
        state.error = action.error.message;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userById = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default usersListSlice.reducer;
