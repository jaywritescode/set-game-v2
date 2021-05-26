import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Game from './Game.jsx';

const socketUrl = 'ws://0.0.0.0:8899/ws';

export default function App() {
  const [room, setRoom] = useState(null);

  const {
    sendJsonMessage,
  } = useWebSocket(socketUrl, {
    onOpen: () => console.log('connection opened'),
    onMessage: (evt) => {
      console.log(`[message] ${evt.data}`);
    }
  });

  const onCreateNewGame = async () => {
    const response = await fetch('/api/create', { method: 'POST' });
    if (response.ok) {
      const json = await response.json();
      const { room } = json;
      setRoom(room);
    }
  }

  if (!room) {
    return (
      <>
        <button onClick={onCreateNewGame}>create new game</button>
        <input type="text" name="game_id" placeholder="ID" />
        <button>join game</button>
      </>
    );
  }

  return (
    <Game room={room} sendJsonMessage={sendJsonMessage} />
  );
}