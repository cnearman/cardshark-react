import './App.css';
import DeviceSelector from './deviceSelector/deviceSelector';
import VideoContainer  from './videoContainer/videoContainer';
import WebSocketProvider from './providers/socketProvider';
import StateContainer from './stateContainer/stateContainer';
 
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
