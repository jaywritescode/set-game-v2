import React, { useState } from "react";

import { ROOM_CODE_LENGTH } from "./App";
import './Entry.css';

export default function Entry(props) {
  const { setRoom } = props;

  const [ roomCode, setRoomCode ] = useState('');

  const onCreateNewGame = async () => {
    handleEnterRoomResponse(await fetch('/api/create', { method: 'POST' }));
  }

  const onJoinGame = async () => {
    if (!roomCode || roomCode.length != ROOM_CODE_LENGTH) {
      return;
    }
    handleEnterRoomResponse(await fetch(`api/join?room=${roomCode}`));
  }

  const handleEnterRoomResponse = async (response) => {
    if (response.ok) {
      const json = await response.json();
      setRoom(json.room);
    }
  };

  const createGameSection = (
    <div className="room-entry-row">
      <button onClick={onCreateNewGame} style={{ width: '100%' }}>
        create new game
      </button>
    </div>
  );

  const onKeyDown = (evt) => {
    setRoomCode(evt.target.value);
  };

  const joinGameSection = (
    <div className="room-entry-row">
      <button
        disabled={roomCode.length < ROOM_CODE_LENGTH}
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
        placeholder="Room code"
        onKeyUp={onKeyDown}
        aria-label="Room Code"
        style={{ width: '9em' }}
      />
    </div>
  );
  
  return (
    <>
      <div className="room-entry">
        {createGameSection}
        <div
          style={{
            marginBottom: '1rem',
            textAlign: 'center',
            fontWeight: 700,
          }}
        >
          or
        </div>
        {joinGameSection}
      </div>
    </>
  );
}