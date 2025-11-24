"use client";
import apiClient from "@/api/apiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunk: Fetch tasks
export const fetchTasks = createAsyncThunk(
  "tasks/fetchTasks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/staff/get-mytask", {
        withCredentials: true,
      });
      console.log(response.myTasks);
      return response.myTasks || [];
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch current user";
      return rejectWithValue(msg);
    }
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    loading: false,
    error: null,
  },
  reducers: {},

  // Handle async states
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload; // store tasks in redux
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default taskSlice.reducer;
