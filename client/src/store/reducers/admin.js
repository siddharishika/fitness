import { createSlice } from "@reduxjs/toolkit";
import { uploadVideo } from "../thunks/admin";

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(uploadVideo.fulfilled, (state, action) => {
      state.name = [...state.name, action.payload];
    });
  },
});

export default adminSlice.reducer;
