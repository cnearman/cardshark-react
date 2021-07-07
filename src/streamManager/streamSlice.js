import { createSlice } from '@reduxjs/toolkit'

export const streamSlice = createSlice({
    name: 'streams',
    initialState: {
        streams: [],
        localStream: null
    },
    reducers: {
        addStream: (state, action) => {
            state.streams.push(action.payload);
        },
        addLocalStream: (state, action) => {
            state.localStream = action.payload;
        }
    }
})

export const {addStream, addLocalStream} = streamSlice.actions;

export default streamSlice.reducer;