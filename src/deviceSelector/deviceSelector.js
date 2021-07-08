import { useState, useRef, useEffect, useContext } from 'react';
import { StateContext } from '../stateContainer/stateContainer';

const initialState = {
    sourceStream: null,
    isSet: false
};

const DeviceSelector = (props) => {
    const videoRef = useRef();
    const [streamData, setStreamData] = useState(initialState);
    
    const stateContext = useContext(StateContext);

    var mediaConstraints = {
        audio: true, 
        video: true
      };

      navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        devices.forEach(function(device) {
            console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId + " label: " + device.label);
          });
      });

      useEffect(()=>{
        navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then((stream) => {
            setStreamData({sourceStream: stream, isSet: true});
            videoRef.current.srcObject = stream;
            stateContext.setLocalStream(stream);
            var rec = new MediaRecorder(stream);
        });
      }, []);
        

      return (
          <video ref={videoRef} autoPlay={"autoPlay"}/>
      );
}

export default DeviceSelector;