import { createSlice } from "@reduxjs/toolkit";

export const uiSlice = createSlice({
  name: "ui",
  initialState: {
    loading: false
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});

export const uiAction = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
