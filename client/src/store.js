import { configureStore } from '@reduxjs/toolkit'
import { uploadVideo } from './store/thunks/admin'

export default configureStore({
  reducer: {
    adminSlice:uploadVideo
  },
})