import { createContext, useContext, useEffect} from 'react';
import io from 'socket.io-client';
import { StateContext } from '../stateContainer/stateContainer';
import axios from 'axios';
const secrets = require('../secrets.json');

const SignalingServiceContext = createContext(null);

export { SignalingServiceContext }

const peers = {};
const state = {};

const SignalingServiceProvider = ({children}) => {

    const streamContext = useContext(StateContext);

    useEffect(() => {
        axios.get(process.env.IceServerEndpoint || secrets.IceServerEndpoint ||'http://localhost:8081/turn/')
        .then(res => {
            state.iceServers = res.data.iceServers; 
        });
    }, [])

    useEffect(()=>{
        console.log(`setting localstream to ${streamContext.getLocalStream()}`);
        state.localStream = streamContext.getLocalStream();
    }, [streamContext])

    const beginConnection = (channelId) => {
        state.socket.emit("join_channel", {channel: channelId}); 
    };

    const addStream = (streamId, stream) => {
        console.log('Adding Remote Stream from addStream');
        streamContext.addRemoteStream(streamId, stream);
    };

    if(!state.socket) {
        state.socket = io(process.env.ServerConnectionString || secrets.ServerConnectionString || "ws://localhost:8081", {
            transports: ['websocket']
        });
        
        state.socket.on('begin_peer_connection', (config) => {
            console.log(`Received begin_peer_connection - ${config.peer_socket_id}`);

            var peer_socket_id = config.peer_socket_id;

            if (peer_socket_id in peers) {
                return;
            }

            var peer_connection = new RTCPeerConnection(
                {"iceServers": state.iceServers},
                {"optional": [{"DtlsSrtpKeyAgreement": true}]}
            );

            peers[peer_socket_id] = peer_connection;

            peer_connection.addEventListener('icecandidate',function(event) {
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
            });

            peer_connection.addEventListener('track', function(event) {
                console.log('Peer Connection - On Add Stream', event);
                if (event.track.kind === 'video'){
                    addStream(peer_socket_id, event.track);
                }
            });

            state.localStream.getTracks().forEach(track => peer_connection.addTrack(track));

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
            var peer_connection = peers[peer_socket_id];
            var remote_description = config.session_description;

            var description = new RTCSessionDescription(remote_description);
            peer_connection.setRemoteDescription(description,
                function() {
                    console.log('setRemoteDescription succeeded');
                    if (remote_description.type === "offer") {
                        console.log('Creating Answer');
                        peer_connection.createAnswer(
                            function(local_description) {
                                console.log(`Answer description is: ${local_description}`)
                                peer_connection.setLocalDescription(local_description, 
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
            var peer_connection = peers[config.peer_socket_id];
            var ice_candidate = config.ice_candidate;
            peer_connection.addIceCandidate(new RTCIceCandidate(ice_candidate)).then(() => {
                console.log(`Ice Candidate Added succesfully- ${config.ice_candidate}`)}
            );
        });

        state.socket.on('connect', () => {
            console.log(`Connected to server. Socket Id: ${state.socket.id}`);
        });

        state.socket.on('removePeer', function(config) {
            console.log('Signaling server said to remove peer:', config);
            var peer_id = config.peer_id;
            streamContext.removeRemoteStream(peer_id);

            if (peer_id in peers) {
                peers[peer_id].close();
            }

            delete peers[peer_id];
        });

        state.socketService = {
            socket : state.socket,
            beginConnection
        };
    }
    return (
        <SignalingServiceContext.Provider value={ state.socketService }>
            {children}
        </SignalingServiceContext.Provider>
    );
}

export default SignalingServiceProvider;