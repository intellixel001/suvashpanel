"use client";
import apiClient from "../../api/apiClient";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 🧩 Async thunk to fetch the currently logged-in user
export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/staff/get-staff", {
        withCredentials: true,
      });
      return response.data?.data || response.data;
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to fetch current user";
      return rejectWithValue(msg);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    logoutUser: (state) => {
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentUser = null;
      });
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
