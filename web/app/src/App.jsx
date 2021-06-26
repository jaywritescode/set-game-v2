import React, { useState } from 'react';

import Entry from './Entry';
import Room from './Room';
import './App.css';

export const ROOM_CODE_LENGTH = 4;

export default function App() {
  const [room, setRoom] = useState(null);

  if (!room) {
    return (<Entry setRoom={setRoom} />);
  }

  return <Room id={room} />;
}
