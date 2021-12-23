import './App.css';
import DeviceSelector from './deviceSelector/deviceSelector';
import VideoContainer  from './videoContainer/videoContainer';
import StateProvider from './stateContainer/stateContainer';
import RouteList from './routes';

import store from './store'
import { Provider } from 'react-redux'
import {  BrowserRouter } from "react-router-dom";
import GameStateProvider from './providers/gameStatusProvider';
import SignalingServiceProvider from './providers/signalingServiceProvider';

function App() {
  return (
    <div className="App">
    <StateProvider>
      <Provider store={store}>
        <BrowserRouter>
          <GameStateProvider>
                <RouteList />
          </GameStateProvider>
        </BrowserRouter>
      </Provider>
    </StateProvider>
    </div>
  );
}

export default App;
