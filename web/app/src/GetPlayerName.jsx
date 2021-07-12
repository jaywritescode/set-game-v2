import React, { useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';

export default function GetPlayerName(props) {
  const { setPlayer, room } = props;

  const [name, setName] = useState('');

  const onKeyUp = (evt) => {
    setName(evt.target.value);
  }

  const onClick = async () => {
    const response = await fetch(`/api/${room}/add_player?name=${name}`, { method: 'POST' });

    if (response.ok) {
        const json = await response.json();
        setPlayer(json.name);
    }
  }

  return (
    <Box>
      <TextField id="player-name" autoFocus={true} name="player-name" label="Who are you?" onKeyUp={onKeyUp} />
      <Button 
        variant="contained" 
        endIcon={<ArrowForward/>}
        disabled={!name.length}
        onClick={onClick}
      >
        OK
      </Button>
    </Box>
  )
}