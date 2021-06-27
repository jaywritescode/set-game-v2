import React, { useState } from 'react';

import Entry from './Entry';
import Room from './Room';
import './App.css';

export const ROOM_CODE_LENGTH = 4;

export default function App() {
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);

  if (!room) {
    return (<Entry setRoom={setRoom} />);
  }
  else if (!player) {
    return (
      <>
        <label htmlFor="player_name">Who are you?</label>
        <input type="text" name="player_name" />
        <button>OK</button>
      </>
    );
  }

  return <Room id={room} />;
}
