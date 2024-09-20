import { createSlice } from "@reduxjs/toolkit";
import { uploadVideo } from "../thunks/admin";



const adminSlice = createSlice({
    name: "admin",
    // initialState: {
    //     name:null ,
    // },
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        // Get playlist
        // .addCase(getSongs.fulfilled, (state, action) => {
        //   state.songs = action.payload;
        // }) // Upload song
        .addCase(uploadVideo.fulfilled, (state, action) => {
          state.name = [...state.name, action.payload];
        })
        // .addCase(uploadVideo.rejected, (state, action) => {
        //   toast.error(action.payload.response.data.message);
        // });
    },
  });

export default adminSlice.reducer;