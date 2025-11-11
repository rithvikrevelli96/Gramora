import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function useSocket() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // or your backend URL
    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return socket;
}

export default useSocket;
