import React, { useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import VideoPlayer from './components/VideoPlayer';
import { SocketContext } from './context/SocketContext';

const App = () => {
  const { id } = useParams(); // Get call ID from URL
  const { joinCall, setCallId } = useContext(SocketContext);

  useEffect(() => {
    if (id) {
      setCallId(id);
      joinCall(id); // Join call with the ID
    }
  }, [id]);

  return (
    <div>
      <VideoPlayer />
    </div>
  );
};

export default App;
