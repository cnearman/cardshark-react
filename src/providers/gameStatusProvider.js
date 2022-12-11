import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { StateContext } from '../stateContainer/stateContainer';
import { useNavigate } from "react-router-dom";
import {useDidMountEffect} from '../hooks/useDidMountEffect'
import { useAuth0 } from '@auth0/auth0-react';
const secrets = require('../secrets.json');

const GameStateContext = createContext(null);

export { GameStateContext }

const state = {};

const GameStateProvider = ({children}) => {
    const {getAccessTokenSilently} = useAuth0();
    const navigate = useNavigate();
    const streamContext = useContext(StateContext);
    const [sessionId, setSessionId] = useState();
    const [authToken, setAuthtoken] = useState();

    useEffect(()=>{
        console.log(`setting localstream to ${streamContext.getLocalStream()}`); 
        state.localStream = streamContext.getLocalStream();
    }, [streamContext]);

    useEffect(() => {
        console.log(`AuthToken: ${authToken}`);
        if(!state.socket) {
            console.log(`Access token: ${token}`)
            state.socket = io(process.env.GameStateServiceConnectionString || secrets.GameStateServiceConnectionString || "ws://localhost:8082", {
                transports: ['websocket'],
                //query: `auth_token=${token}`
            });
            
            state.socket.on('join_session', (config) => {
                saveSessionId(config.session_id)
            });
    
    
            state.socket.on('connect', () => {
                console.log(`Connected to server. Socket Id: ${state.socket.id}`);
            }); 

            state.socket.on('navigate', (body) => {
                console.log(`Received navigate event to ${body.path}`);
                navigate(body.path);
            });
    
            state.socket.on('removePeer', function(config) {
            });
    
            state.socket.on('updateState', function(newState) {
                state.gameState = newState;
            })
    
            state.socketService = {
                socket : state.socket,
                gameState : state.gameState, 
                newSession,
                joinSession
            };
        }
    }, [authToken]);

    useDidMountEffect(() =>{
        navigate(`chat/${sessionId}`);
    }, [sessionId]);

    const newSession = () => {        
        state.socket.emit("new_session"); 
    }

    const joinSession = (sessionId, name) => {
        state.socket.emit("join_session", {sessionId: sessionId, name: name})
    }

    const saveSessionId = (sessionId) => {
        setSessionId(sessionId);
        console.log(sessionId);
    };

    let token = getAccessTokenSilently().then(setAuthtoken);

    return (
        <GameStateContext.Provider value={ state.socketService }>
            {children}
        </GameStateContext.Provider>
    );
}

export default GameStateProvider;