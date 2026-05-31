import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const uploadVideo = createAsyncThunk(
  "admin/uploadvideo",
  async ({ data }, { rejectWithValue }) => {
    try {
      let res = await axios({
        method: "post",
        url: "/admin/upload",
        data: data,
      });
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);
