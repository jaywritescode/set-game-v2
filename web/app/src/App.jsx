import React, { useState } from 'react';
import { Button, Container, SvgIcon, TextField } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';

import Entry from './Entry';
import Room from './Room';
import './App.css';

export const ROOM_CODE_LENGTH = 4;

export default function App() {
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);

  if (!room) {
    return (
      <Container maxWidth="xs">
        <Entry setRoom={setRoom} />
      </Container>
    );
  } else if (!player) {
    return (
      <>
        <Container maxWidth="xs">
          <TextField id="player-name" label="Who are you?" />
          <Button variant="contained" endIcon={<ArrowForward/>}>OK</Button>
        </Container>
      </>
    );
  }

  return <Room id={room} />;
}
