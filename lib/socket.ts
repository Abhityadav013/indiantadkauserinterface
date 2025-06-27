import { io, Socket } from 'socket.io-client';

// Socket.IO client configuration for connecting to admin server
const SOCKET_URL = process.env.NEXT_PUBLIC_ADMIN_SOCKET_URL || 'http://localhost:3000';

let socket: Socket | null = null;

declare global {
  // Declare io with a specific type instead of 'any' and use 'let'
  let io: typeof import('socket.io-client').io;
}

export const getSocket = (): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    if (socket?.connected) {
      console.log('SOCKET: Returning existing connected socket.');
      return resolve(socket);
    }

    if (socket) {
      console.log('SOCKET: Existing socket found but not connected, waiting for it to connect...');
      const existingSocket = socket;
      existingSocket.once('connect', () => {
        console.log('✅ SOCKET: Existing socket connected.');
        resolve(existingSocket);
      });
      existingSocket.once('connect_error', (error) => {
        console.error('❌ SOCKET: Existing socket connection error.', error);
        reject(error);
      });
      return;
    }
    
    console.log(`SOCKET: No active socket, creating new connection to ${SOCKET_URL}...`);
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    newSocket.once('connect', () => {
      console.log('✅ SOCKET: New socket connected successfully:', newSocket.id);
      socket = newSocket;
      resolve(socket);
    });

    newSocket.once('connect_error', (error) => {
      console.error('❌ SOCKET: New socket connection error:', error);
      console.error('❌ SOCKET: Error details:', {
        message: error.message,
        name: error.name
      });
      newSocket.disconnect();
      reject(error);
    });

    // Add additional event listeners for debugging
    newSocket.on('connect', () => {
      console.log('✅ SOCKET: Socket connected:', newSocket.id);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ SOCKET: Socket disconnected:', reason);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 SOCKET: Socket reconnected after', attemptNumber, 'attempts');
    });

    newSocket.on('reconnect_error', (error) => {
      console.error('❌ SOCKET: Socket reconnection error:', error);
    });
  });
};

export const disconnectSocket = () => {
  if (socket) {
    console.log('SOCKET: Disconnecting socket...');
    socket.disconnect();
    socket = null;
  }
};

// Helper function to emit reservation events
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const emitReservationEvent = async (reservationData: any) => {
  try {
    console.log('--------------------------------------------------');
    console.log('🚀 CLIENT: Attempting to emit reservation event...');
    
    // Use direct connection approach like the working test script
    const directSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000,
    });

    directSocket.on('connect', () => {
      console.log('✅ CLIENT: Direct socket connected:', directSocket.id);
      
      directSocket.emit('new-online-booking', reservationData);      
      console.log(`✅ CLIENT: Successfully emitted events for reservation: ${reservationData.displayId}`);
      
      // Disconnect after emitting events
      setTimeout(() => {
        directSocket.disconnect();
        console.log('✅ CLIENT: Direct socket disconnected after emitting events');
      }, 1000);
    });

    directSocket.on('connect_error', (error) => {
      console.error('❌ CLIENT: Direct socket connection error:', error.message);
      directSocket.disconnect();
    });

    directSocket.on('disconnect', () => {
      console.log('✅ CLIENT: Direct socket disconnected');
    });
    
    console.log('--------------------------------------------------');
    
  } catch (error) {
    console.error('--------------------------------------------------');
    console.error('❌ CLIENT: ERROR in emitReservationEvent:', error);
    if (error instanceof Error) {
      console.error('❌ CLIENT: Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    console.error('--------------------------------------------------');
  }
}; 