import { createContext, useState } from 'react';

const StateContext = createContext({
    videoStreams : [],
    localStream : null,
    setLocalStream : () => {},
    addRemoteStream : () => {}
});

export { StateContext }

export default ({children}) => {

    const setLocalStream = (stream) =>{
        console.log('setting local stream');
        setState({...state, localStream: stream});
    }

    const addRemoteStream = (stream) => {
        console.log('adding remote stream');
        setState({...state, videoStreams: [...state.videoStreams, stream]})
    }

    const initialState = {
        videoStreams : [],
        localStream : null,
        setLocalStream: setLocalStream,
        addRemoteStream: addRemoteStream
    }

    const [state, setState] = useState(initialState);

    return (
        <StateContext.Provider value={ state }>
            {children}
        </StateContext.Provider>
    );
}