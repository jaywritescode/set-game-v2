import React, { useState } from 'react';
import { Box, Button, Divider, TextField } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { ROOM_CODE_LENGTH } from './App';
import './Entry.css';

export default function Entry(props) {
  const { setRoom } = props;

  const [roomCode, setRoomCode] = useState('');

  const onCreateNewGame = async () => {
    handleEnterRoomResponse(await fetch('/api/create', { method: 'POST' }));
  };

  const onJoinGame = async () => {
    if (!roomCode || roomCode.length != ROOM_CODE_LENGTH) {
      return;
    }
    handleEnterRoomResponse(await fetch(`api/join?room=${roomCode}`));
  };

  const handleEnterRoomResponse = async (response) => {
    if (response.ok) {
      const json = await response.json();
      setRoom(json.room);
    }
  };

  const onKeyUp = (evt) => {
    setRoomCode(evt.target.value);
  };

  return (
    <>
      <Box>
        <Button onClick={onCreateNewGame} variant="contained" fullWidth={true}>
          create new game
        </Button>
      </Box>

      {React.createElement(
        styled(Divider)({
          border: 'none',
          borderTop: '3px double #333',
          color: '#333',
          overflow: 'visible',
          textAlign: 'center',
          height: '5px',
          fontWeight: 700,
          margin: '2rem auto',
          textTransform: 'uppercase',
          '&::after': {
            background: '#fff',
            padding: '0 11px',
            content: '"or"',
            position: 'relative',
            top: '-13px',
          },
        }),
      )}

      <Box display="flex" justifyContent="space-between">
        <Box flexGrow={2}>
          <Button
            onClick={onJoinGame}
            variant="contained"
            disabled={roomCode.length < ROOM_CODE_LENGTH}
            fullWidth={true}
          >
            join game
          </Button>
        </Box>
        <i
          className="fa fa-2x fa-arrow-circle-right"
          style={{ margin: '3px 4px', color: '#9b4dca' }}
        />
        <Box>
          <TextField
            size="small"
            variant="outlined"
            label="Room code"
            onKeyUp={onKeyUp}
            fullWidth={true}
            inputProps={{
              size: 10,
              'aria-label': 'Room Code',
            }}
          />
        </Box>
      </Box>
    </>
  );
}
