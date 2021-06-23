import React, { useState } from 'react';

import Room from './Room';
import './App.css';

const ROOM_CODE_LENGTH = 4;

export default function App() {
  const [room, setRoom] = useState(null);
  const [roomCodeInput, setRoomCodeInput] = useState('');

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

  const onKeyDown = (evt) => {
    setRoomCodeInput(evt.target.value);
  };

  const handleEnterRoomResponse = async (response) => {
    const json = await response.json();
    setRoom(json.room);
  };

  if (!room) {
    return (
      <>
        <div className="room_entry">
          <div id="create_row" className="row">
            <button onClick={onCreateNewGame}>create new game</button>
          </div>
          <div className="d2">or</div>
          <div id="join_row" className="row">
            <button
              disabled={roomCodeInput.length < ROOM_CODE_LENGTH}
              onClick={onJoinGame}
            >
              join game
            </button>
            <input
              type="text"
              id="room_code"
              name="room_code"
              placeholder="Room code"
              onKeyUp={onKeyDown}
              aria-label="Room Code"
            />
          </div>
        </div>
      </>
    );
  }

  return <Room id={room} />;
}
