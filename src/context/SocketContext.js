import React, { createContext, useState, useRef, useEffect } from 'react';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { v4 as uuidv4 } from 'uuid';

const SocketContext = createContext();

const socket = io('http://localhost:5000'); // Replace with your server URL

const SocketProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callId, setCallId] = useState('');
    const [callEnded, setCallEnded] = useState(false); // Initialize state
    const connectionRef = useRef();
    const myVideo = useRef();
    const userVideo = useRef();

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
            setStream(stream);
            if (myVideo.current) {
                myVideo.current.srcObject = stream;
            }
        }).catch(error => console.error('Media Error:', error));

        socket.on('callUser', ({ from, name, signal, id }) => {
            setCall({ isReceivingCall: true, from, name, signal, id });
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            if (connectionRef.current) {
                connectionRef.current.signal(signal);
            }
        });

        socket.on('callEnded', () => {
            setCallEnded(true);
            if (connectionRef.current) {
                connectionRef.current.destroy();
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('callUser', { userToCall: id, signalData: data, from: socket.id, name, id });
        });

        peer.on('stream', (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        peer.on('error', (err) => {
            console.error('Peer Error:', err); // Log errors
        });

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const joinCall = (id) => {
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: call.from, id });
        });

        peer.on('stream', (currentStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = currentStream;
            }
        });

        peer.on('error', (err) => {
            console.error('Peer Error:', err); // Log errors
        });

        if (call && call.signal) {
            peer.signal(call.signal);
        } else {
            console.error('Call signal is undefined');
        }

        connectionRef.current = peer;
    };

    const leaveCall = () => {
        socket.emit('endCall', { id: callId });
        setCallEnded(true);
        if (connectionRef.current) {
            connectionRef.current.destroy();
        }
    };

    return (
        <SocketContext.Provider value={{
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
            joinCall,
            leaveCall,
            callEnded,
            setCallEnded
        }}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };
