import logo from './logo.svg';
import './App.css';
import { useContext } from "react";
import DeviceSelector from './deviceSelector/deviceSelector';
import VideoContainer  from './videoContainer/videoContainer';
import WebSocketProvider, {WebSocketContext} from './providers/socketProvider';
import StateContainer, { StateContext } from './stateContainer/stateContainer';
 
import store from './store'
import { Provider } from 'react-redux'

function App() {
  return (
    <div className="App">
    <StateContainer>
      <Provider store={store}>
        <WebSocketProvider>
          <VideoContainer/>
          <DeviceSelector/>
        </WebSocketProvider>
      </Provider>
    </StateContainer>
    </div>
  );
}

export default App;
