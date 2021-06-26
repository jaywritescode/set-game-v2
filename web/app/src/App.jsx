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
        <div className="room-entry">
          <div className="room-entry-row">
            <button onClick={onCreateNewGame} style={{ width: '100%' }}>
              create new game
            </button>
          </div>
          <div
            style={{
              marginBottom: '1rem',
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            or
          </div>
          <div className="room-entry-row">
            <button
              disabled={roomCodeInput.length < ROOM_CODE_LENGTH}
              onClick={onJoinGame}
              style={{ flexGrow: 2 }}
            >
              join game
            </button>
            <i
              className="fa fa-2x fa-arrow-circle-right"
              style={{ margin: '3px 4px', color: '#9b4dca' }}
            />
            <input
              type="text"
              id="room_code"
              name="room_code"
              placeholder="Room code"
              onKeyUp={onKeyDown}
              aria-label="Room Code"
              style={{ width: '9em' }}
            />
          </div>
        </div>
      </>
    );
  }

  return <Room id={room} />;
}
