import React, { useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { ArrowForward } from '@material-ui/icons';
import { nanoid } from 'nanoid';

export default function GetPlayerName(props) {
  const { setPlayer, room } = props;

  const [name, setName] = useState('');

  const onKeyUp = (evt) => {
    setName(evt.target.value);
  };

  const onClick = async () => {
    const id = nanoid();
    const response = await fetch(`/api/${room}/add_player?name=${name}&id=${id}`, {
      method: 'POST',
    });

    if (response.ok) {
      const json = await response.json();
      const { response_name: name, response_id: id } = json;

      if (response_name == name && response_id == id) {
        setPlayer({ name, id });
      }
    }
  };

  return (
    <Box>
      <TextField
        id="player-name"
        autoFocus={true}
        name="player-name"
        label="Who are you?"
        onKeyUp={onKeyUp}
      />
      <Button
        variant="contained"
        endIcon={<ArrowForward />}
        disabled={!name.length}
        onClick={onClick}
      >
        OK
      </Button>
    </Box>
  );
}
