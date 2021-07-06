import { createContext } from 'react';
import io from 'socket.io-client';

const WebSocketContext = createContext(null);

export { WebSocketContext }

export default ({children}) => {
    let socket;
    let socketService;

    const beginConnection = (channelId) => {
        socket.emit("join_channel", {channel: channelId});
    };

    if(!socket){
        socket = io("ws://localhost:8081", {
        transports: ['websocket']
        });

        //socket.connect();

        socket.on('connect', () => {
            console.log(`Connected to server. Socket Id: ${socket.id}`);
        });

        socketService = {
            socket : socket,
            beginConnection
        };
    }
    return (
        <WebSocketContext.Provider value={ socketService }>
            {children}
        </WebSocketContext.Provider>
    );
}