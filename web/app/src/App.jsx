import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Game from './Game.jsx';

const socketUrl = 'ws://0.0.0.0:8899/ws';
const ROOM_CODE_LENGTH = 4;

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

  const onJoinGame = async () => {
    const room = document.getElementById('room_code').value;
    if (!room || room.length != ROOM_CODE_LENGTH) {
      return;
    }

    const response = await fetch(`/api/join?room=${room}`);
    if (response.ok) {
      const json = await response.json();
      const { room } = json;
      setRoom(room);
    }
    else {
      // handle 404
    }
  }

  if (!room) {
    return (
      <>
        <button onClick={onCreateNewGame}>create new game</button>
        <input type="text" id="room_code" name="room_code" placeholder="ID" />
        <button onClick={onJoinGame}>join game</button>
      </>
    );
  }

  return (
    <Game room={room} sendJsonMessage={sendJsonMessage} />
  );
}