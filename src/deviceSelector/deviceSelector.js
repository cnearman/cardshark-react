import {  useRef, useEffect, useContext, useState } from 'react';
import { StateContext } from '../stateContainer/stateContainer';

const DeviceSelector = (props) => {
    const videoRef = useRef();
    const [isStreamSet, setIsStreamSet] = useState(false);
    const stateContext = useContext(StateContext);

      navigator.mediaDevices.enumerateDevices()
      .then((devices) => {
        devices.forEach(function(device) {
            console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId + " label: " + device.label);
          });
      });

      useEffect(()=>{

        var mediaConstraints = {
            audio: true, 
            video: true
        };

        navigator.mediaDevices.getUserMedia(mediaConstraints)
        .then((stream) => {
          if (!isStreamSet) {
            videoRef.current.srcObject = stream;
            stateContext.setLocalStream(stream);
            //var rec = new MediaRecorder(stream);
            setIsStreamSet(true);
          }
        });
      }, [stateContext, isStreamSet]);
        

      return (
          <video ref={videoRef} autoPlay={"autoPlay"}/>
      );
}

export default DeviceSelector;