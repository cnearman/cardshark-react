import { useContext } from "react";
import { WebSocketContext } from "../providers/socketProvider";
import { StateContext } from '../stateContainer/stateContainer';
import VideoElement from "./videoElement";

const VideoContainer = (props) => {
    const socketProvider = useContext(WebSocketContext);
    const state = useContext(StateContext);

    return (
        <div>
            <button onClick={() => socketProvider.beginConnection("only")}>Connect</button>
            <button onClick={() => console.log(state)}>Log Stream Data</button>
            <div>{state.localStream? "Has Local Stream" : "No Local Stream"}</div>
            <div>Remote Connections: {state.getRemoteStreams().length}</div>
            
            { state.getRemoteStreams().map((value, index) => {
                return <VideoElement key={index} stream={value}/>
            })}
        </div>
    );
}

export default VideoContainer;