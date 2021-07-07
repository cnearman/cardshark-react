import logo from './logo.svg';
import './App.css';
import DeviceSelector from './deviceSelector/deviceSelector';
import VideoContainer  from './videoContainer/videoContainer';
import WebSocketProvider, {WebSocketContext} from './providers/socketProvider';

import store from './store'
import { Provider } from 'react-redux'

function App() {
  return (
    <div className="App">
    <Provider store={store}>
      <WebSocketProvider>
        <VideoContainer/>
        <DeviceSelector/>
      </WebSocketProvider>
    </Provider>
    </div>
  );
}

export default App;
