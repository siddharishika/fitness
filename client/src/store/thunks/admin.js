import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";



export const uploadVideo = createAsyncThunk(
    "admin/uploadvideo",
    async ({ data }, { rejectWithValue }) => {
      try {
        // let {name , fitnessVideo} =data;
        // let res = await axios.post(`admin/upload`,data: data , 
        //     {headers: {
        //         'Content-Type': 'multipart/form-data'
        //     }});
        let res=await axios({
            method: "post",
            url: "/admin/upload",
            data: data,
            // headers: { "Content-Type": "multipart/form-data" },
          })
        // toast.success("Song uploaded");
        // return res.data;
      } catch (err) {
        return rejectWithValue(err);
      }
    },
  );