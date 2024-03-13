import React from 'react';
import { Socket } from 'socket.io-client';

// Create a context with a default value (optional).
// Here, the default value is set to null.
const SocketContext = React.createContext<Socket | null>(null);

export default SocketContext;
