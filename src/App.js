import logo from './logo.svg';
import './App.css';
import DeviceSelector from './deviceSelector/deviceSelector';
import VideoContainer  from './videoContainer/videoContainer';
import WebSocketProvider, {WebSocketContext} from './providers/socketProvider';

function App() {
  return (
    <div className="App">
      <WebSocketProvider>
        <VideoContainer/>
        <DeviceSelector/>
      </WebSocketProvider>
    </div>
  );
}

export default App;
