import { useContext } from "react";
import { WebSocketContext } from "../providers/socketProvider";

const VideoContainer = () => {
    const socketProvider = useContext(WebSocketContext);
    socketProvider.socket.on('begin_peer_connection', (config) => {
        console.log('Received begin_peer_connection');
    });

    return (
        <div>
            <button onClick={() => socketProvider.beginConnection("only")}>Connect</button>
        </div>
    );
}

export default VideoContainer;