import {useEffect, useRef} from 'react';

const VideoElement = (props) => {
    const videoRef = useRef();
    useEffect(()=> {
        videoRef.current.srcObject = props.stream;
    }, [props.stream]);

    return(        
        <video ref={videoRef} autoPlay={"autoPlay"}/>
    );
}

export default VideoElement;