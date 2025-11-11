import React from 'react';
import useSocket from '../hooks/useSocket';

function Chat() {
  const socket = useSocket();

  if (!socket) return <div>Connecting to chat...</div>;

  return (
    <div>
      <h2>Chat Room</h2>
      {/* Chat logic here */}
    </div>
  );
}

export default Chat;
