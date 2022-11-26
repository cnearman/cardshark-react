import { configureStore } from '@reduxjs/toolkit'
import streamsReducer from './streamManager/streamSlice'
import sceneReducer from './streamManager/sceneSlice'

export default configureStore({
  reducer: {
      streams: streamsReducer,
      scenes: sceneReducer
  }
})