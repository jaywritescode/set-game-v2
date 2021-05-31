import React, { useState } from 'react';

import Room from './Room';

const ROOM_CODE_LENGTH = 4;

export default function App() {
  const [room, setRoom] = useState(null);

  const onCreateNewGame = async () => {
    const response = await fetch('/api/create', { method: 'POST' });
    if (response.ok) {
      handleEnterRoomResponse(response);
    }
  };

  const onJoinGame = async () => {
    const room = document.getElementById('room_code').value;
    if (!room || room.length != ROOM_CODE_LENGTH) {
      return;
    }

    const response = await fetch(`api/join?room=${room}`);
    if (response.ok) {
      handleEnterRoomResponse(response);
    }
  };

  const handleEnterRoomResponse = async (response) => {
    const json = await response.json();
    setRoom(json.room);
  };

  if (!room) {
    return (
      <>
        <button onClick={onCreateNewGame}>create new game</button>
        <input type="text" id="room_code" name="room_code" placeholder="ID" />
        <button onClick={onJoinGame}>join game</button>
      </>
    );
  }

  return <Room id={room} />;
}
