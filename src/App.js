import logo from './logo.svg';
import './App.css';
import DeviceSelector from './deviceSelector/deviceSelector';

import io from "socket.io-client";

const socket = io("ws://localhost:8081", {
  transports: ['websocket']
});

socket.connect();

function App() {
  return (
    <div className="App">
      <DeviceSelector/>
    </div>
  );
}

export default App;
