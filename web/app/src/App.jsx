import React from 'react';
import useWebSocket from 'react-use-websocket';

import Game from './Game.jsx';

const socketUrl = 'ws://0.0.0.0:8899/ws';

export default function App() {
  const {
    sendJsonMessage,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
  });

  return (
    <Game />
  );
}