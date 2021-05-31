import React, { useState } from 'react';
import useWebSocket from 'react-use-websocket';

import Game from './Game';

const socketUrl = 'ws://0.0.0.0:8899/ws';

export default function Room(props) {
  const [board, setBoard] = useState([]);

  const { id } = props;

  const handleMessageReceived = (msg) => {
    data = JSON.parse(msg);
    switch (data.type) {
    }
  };
  const { sendJsonMessage } = useWebSocket(`${socketUrl}/${id}`, {
    onMessage: handleMessageReceived,
  });

  

  return (
    <>
      <div id={id}>room code: {id}</div>
      <Game room="aabc" sendJsonMessage={() => {}} />
    </>
  )

  // return <Game board={board} />;
}
