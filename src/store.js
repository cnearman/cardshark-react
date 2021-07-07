import { configureStore } from '@reduxjs/toolkit'
import streamsReducer from './streamManager/streamSlice'

export default configureStore({
  reducer: {
      streams: streamsReducer
  },
})