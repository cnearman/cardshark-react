import { createContext } from 'react';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addStream } from '../streamManager/streamSlice';

const WebSocketContext = createContext(null);

export { WebSocketContext }

const ICE_SERVERS = [
    {url:"stun:stun.l.google.com:19302"}
];

const peers = {};

export default ({children}) => {
    let socket;
    let socketService;

    const localStream = useSelector((state) => state.streams.localStream);
    const dispatch = useDispatch();

    const beginConnection = (channelId) => {
        socket.emit("join_channel", {channel: channelId});
    };

    if(!socket){
        socket = io("ws://localhost:8081", {
        transports: ['websocket']
        });
        
        socket.on('begin_peer_connection', (config) => {
            console.log('Received begin_peer_connection');

            var peer_socket_id = config.peer_socket_id;

            if (peer_socket_id in peers) {
                return;
            }

            var peer_connection = new RTCPeerConnection(
                {"iceServers": ICE_SERVERS},
                {"optional": [{"DtlsSrtpKeyAgreement": true}]}
            );

            peers[peer_socket_id] = peer_connection;

            peer_connection.onicecandidate = function(event) {
                if (event.candidate) {
                    socket.emit('trxICECandidate', {
                        'peer_socket_id' : peer_socket_id,
                        'ice_candidate' : { 
                            'sdpMLineIndex' : event.candidate.sdpMLineIndex,
                            'candidate' : event.candidate.candidate
                        }
                    });
                }
            }

            peer_connection.onaddstream = function(event) {
                // Can't use redux to move this around because it can't be serialized ??
                dispatch(addStream(event.stream));
            }

            peer_connection.addStream(localStream);

            if (config.should_create_offer) {
                peer_connection.createOffer(
                    function (local_description) {
                        peer_connection.setLocalDescription(local_description,
                            function(){
                                socket.emit('relaySessionDescription', {'peer_socket_id': peer_socket_id, 'session_description': local_description});
                            },
                            function() { alert("Offer setLocalDescription succeeded"); }
                        );
                    },
                    function (error) {
                        console.log ("Error sending offer: ", error);
                    }
                );
            }
        });

        socket.on('sessionDescription', (config) => {
            var peer_socket_id = config.peer_socket_id;
            var peer = peers[peer_socket_id];
            var remote_description = config.session_description;

            var description = new RTCSessionDescription(remote_description);
            peer.setRemoteDescription(description,
                function() {
                    if (remote_description.type === "offer") {
                        peer.createAnswer(
                            function(local_description) {
                                peer.setLocalDescription(local_description, 
                                    function() {
                                        socket.emit('relaySessionDescription', {'peer_socket_id': peer_socket_id, 'session_description': local_description});
                                    },                                    
                                    function() { alert("Answer setLocalDescription failed!"); }
                                )
                            },
                            function(error) {
                                console.log("Error creating answer: ", error);
                            }
                        );
                    }
                },
                function(error) {
                    console.log("setRemoteDescription error: ", error);
                }
            );
        });

        socket.on('iceCandidate', (config) => {
            var peer = peers[config.peer_socket_id];
            var ice_candidate = config.ice_candidate;
            peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
        });

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