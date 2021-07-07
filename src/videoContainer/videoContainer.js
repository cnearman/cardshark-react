import { useContext } from "react";
import { WebSocketContext } from "../providers/socketProvider";

const VideoContainer = () => {
    const socketProvider = useContext(WebSocketContext);

    return (
        <div>
            <button onClick={() => socketProvider.beginConnection("only")}>Connect</button>
        </div>
    );
}

export default VideoContainer;