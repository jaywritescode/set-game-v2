import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Game from './Game';

const socketUrl = 'ws://0.0.0.0:8899/ws';

export default function Room(props) {
  const { id } = props;

  const handleMessageReceived = (msg) => {
    console.log(msg);
    console.log(JSON.parse(msg.data));
  };
  const { sendJsonMessage } = useWebSocket(`${socketUrl}/${id}`, {
    onMessage: handleMessageReceived,
  });

  const submit = (cards) => {
    return sendJsonMessage({
      cards
    });
  }

  return (
    <>
      <div id={id}>room code: {id}</div>
      <Game room={id} submit={submit} />
    </>
  );
}
