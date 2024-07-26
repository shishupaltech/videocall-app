import React, { useContext, useState, useEffect, useRef } from 'react';
import { SocketContext } from '../context/SocketContext';
import { v4 as uuidv4 } from 'uuid';

const VideoPlayer = () => {
    const {
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callId,
        setCallId,
        callUser,
        leaveCall,
        joinCall,
        callEnded,
        answerCall
    } = useContext(SocketContext);

    const [callUrl, setCallUrl] = useState('');

    useEffect(() => {
        if (callId) {
            setCallUrl(`${window.location.origin}/call/${callId}`);
        }
    }, [callId]);

    useEffect(() => {
        if (call.isReceivingCall && !callAccepted) {
            console.log('Incoming call from:', call.name); // Debug log
        }
    }, [call, callAccepted]);

    const startCall = () => {
        const id = uuidv4(); // Generate unique ID
        setCallId(id);
        callUser(id); // Call with unique ID
    };

    return (
        <div>
            <div>
                <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />
                {callAccepted && !callEnded ? (
                    <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
                ) : null}
            </div>
            <div>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" />
                <button onClick={startCall}>Start Call</button>
                {call.isReceivingCall && !callAccepted && (
                    <div>
                        <h1>{call.name} is calling:</h1>
                        <button onClick={answerCall}>Answer</button>
                    </div>
                )}
                {callAccepted && !callEnded && (
                    <button onClick={leaveCall}>End Call</button>
                )}
                {callUrl && (
                    <div>
                        <h2>Share this URL with your friend:</h2>
                        <p>{callUrl}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer;
