import { createContext, useState } from 'react';

const StateContext = createContext(null);

export { StateContext }

const StateProvider = ({children}) => {
    const [remoteStreams, setRemoteStreams] = useState(() => {console.log('Initialize Remote Streams'); return [];});

    const [localStreamObject, setLocalStreamObject] = useState(() => {console.log('Initialize Local Stream'); return null;});

    const setLocalStream = (stream) => {
        console.log('LocalStream: ' + localStreamObject);
        setLocalStreamObject(stream);
    }

    const addRemoteStream = (stream) => {
        console.log('adding remote stream');
        console.log('Number of connections: ' + remoteStreams.length);
        setRemoteStreams(previousValue => [...previousValue, stream]);
    }

    const getLocalStream = () => {
        console.log('LocalStream: ' + localStreamObject);
        return localStreamObject;
    }

    const getRemoteStreams = () => {
        return remoteStreams;
    }

    return (
        <StateContext.Provider value={{ getRemoteStreams,
            setLocalStream, 
            addRemoteStream,
            getLocalStream }}>
            {children}
        </StateContext.Provider>
    );
}

export default StateProvider;