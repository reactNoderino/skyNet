import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchColumns = createAsyncThunk(
  "columns/fetchColumns",
  async (boardId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/boards/${boardId}/columns`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createColumn = createAsyncThunk(
  "columns/createColumn",
  async ({ boardId, columnData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/boards/${boardId}/columns`,
        columnData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateColumn = createAsyncThunk(
  "columns/updateColumn",
  async ({ columnId, columnData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/columns/${columnId}`,
        columnData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteColumn = createAsyncThunk(
  "columns/deleteColumn",
  async (columnId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/columns/${columnId}`, {
        withCredentials: true,
      });
      return columnId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const columnsSlice = createSlice({
  name: "columns",
  initialState: {
    items: [],
    isLoading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColumns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchColumns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createColumn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createColumn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.push(action.payload);
      })
      .addCase(createColumn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateColumn.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (col) => col._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.items = state.items.filter((col) => col._id !== action.payload);
      });
  },
});

export default columnsSlice.reducer;
