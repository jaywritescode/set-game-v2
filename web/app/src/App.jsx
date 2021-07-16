import React, { useState } from 'react';
import { Container } from '@material-ui/core';
import _ from 'lodash';

import EnterRoom from './EnterRoom';
import GetPlayerName from './GetPlayerName';
import Room from './Room';

export const ROOM_CODE_LENGTH = 4;

export default function App() {
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState({});

  const ready = room && !_.isEmpty(player);

  if (!ready) {
    return (
      <Container maxWidth="xs">
        {!room ? (
          <EnterRoom setRoom={setRoom} />
        ) : (
          <GetPlayerName room={room} setPlayer={setPlayer} />
        )}
      </Container>
    );
  }

  return <Room id={room} player={player} />;
}
