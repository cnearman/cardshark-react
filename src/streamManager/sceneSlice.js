import { createSlice } from '@reduxjs/toolkit'

export const sceneSlice = createSlice({
    name: 'scenes',
    initialState: {
        sceneData: {}
    },
    reducers: {
        updateState: (state, action) => {
            state.sceneData = action.payload;
        }
    }
})

export const {updateState} = sceneSlice.actions;

export default sceneSlice.reducer;