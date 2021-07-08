import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { StateContext } from '../stateContainer/stateContainer';

const WebSocketContext = createContext(null);

export { WebSocketContext }

const ICE_SERVERS = [
    {url:"stun:stun.l.google.com:19302"}
];

const peers = {};
const state = {};

export default ({children}) => {

    const streamContext = useContext(StateContext);

    const [localStream, setLocalStream] = useState(null);

    const [streams, setStreams] = useState([]);

    const [newStream, setNewStream] = useState(null);

    useEffect(()=>{
        console.log(`setting localstream to ${streamContext.localStream}`);
        setLocalStream(streamContext.localStream);
        state.localStream = streamContext.localStream;
    }, [streamContext])

    useEffect(() =>{
        console.log('adding stream to remotes');
        streamContext.addRemoteStream(newStream);
    }, [newStream])

    const beginConnection = (channelId) => {
        state.socket.emit("join_channel", {channel: channelId}); 
    };

    if(!state.socket) {
        state.socket = io("ws://localhost:8081", {
            transports: ['websocket']
        });
        
        state.socket.on('begin_peer_connection', (config) => {
            console.log(`Received begin_peer_connection - ${config.peer_socket_id}`);

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
                console.log('Peer Connection - On ICE Candidate');
                if (event.candidate) {
                    state.socket.emit('trxICECandidate', {
                        'peer_socket_id' : peer_socket_id,
                        'ice_candidate' : { 
                            'sdpMLineIndex' : event.candidate.sdpMLineIndex,
                            'candidate' : event.candidate.candidate
                        }
                    });
                }
            }

            peer_connection.onaddstream = function(event) {
                console.log('Peer Connection - On Add Stream', event);
                setNewStream(event.stream);
            }
            
            peer_connection.addStream(state.localStream);

            if (config.should_create_offer) {
                peer_connection.createOffer(
                    function (local_description) {
                        console.log("Local offer description is: ", local_description);
                        peer_connection.setLocalDescription(local_description,
                            function(){
                                state.socket.emit('relaySessionDescription', {'peer_socket_id': peer_socket_id, 'session_description': local_description});
                                console.log("Offer setLocalDescription succeeded");
                            },
                            function() { console.log("Offer setLocalDescription failed"); }
                        );
                    },
                    function (error) {
                        console.log ("Error sending offer: ", error);
                    }
                );
            }
        });

        state.socket.on('sessionDescription', (config) => {
            console.log(`Socket - Session Description - ${config.session_description}`);
            var peer_socket_id = config.peer_socket_id;
            var peer = peers[peer_socket_id];
            var remote_description = config.session_description;

            var description = new RTCSessionDescription(remote_description);
            peer.setRemoteDescription(description,
                function() {
                    console.log('setRemoteDescription succeeded');
                    if (remote_description.type === "offer") {
                        console.log('Creating Answer');
                        peer.createAnswer(
                            function(local_description) {
                                console.log(`Answer description is: ${local_description}`)
                                peer.setLocalDescription(local_description, 
                                    function() {
                                        state.socket.emit('relaySessionDescription', {'peer_socket_id': peer_socket_id, 'session_description': local_description});
                                        console.log('Answer setLocalDescription succeeded');
                                    },                                    
                                    function() { console.log("Answer setLocalDescription failed!"); }
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

        state.socket.on('iceCandidate', (config) => {
            console.log(`Socket - Ice Candidate - ${config.peer_socket_id}`);
            var peer = peers[config.peer_socket_id];
            var ice_candidate = config.ice_candidate;
            peer.addIceCandidate(new RTCIceCandidate(ice_candidate));
        });

        state.socket.on('connect', () => {
            console.log(`Connected to server. Socket Id: ${state.socket.id}`);
        });

        state.socketService = {
            socket : state.socket,
            beginConnection
        };
    }
    return (
        <WebSocketContext.Provider value={ state.socketService }>
            {children}
        </WebSocketContext.Provider>
    );
}