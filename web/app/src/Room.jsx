import React, { useEffect, useReducer, useState } from 'react';
import _ from 'lodash';
import produce from 'immer';
import useWebSocket from 'react-use-websocket';

import Game from './Game';

const socketUrl = 'ws://0.0.0.0:8899/ws';

export default function Room(props) {
  const { id } = props;

  const initialState = {
    board: [],
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'start-game': {
        return produce((draft) => {
          draft.board = action.payload['board'];
        })(state);
      }
      case 'set-found': {
        return produce((draft) => {
          draft.board = action.payload['board'];
        })(state);
      }
      default: {
        console.error('No type found for action: %O', action);
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(async () => {
    const response = await fetch(`/api/start/${id}`);
    const result = await response.json();

    dispatch(result);
  }, []);

  const { sendJsonMessage } = useWebSocket(`${socketUrl}/${id}`, {
    onMessage: (msg) => {
      const action = JSON.parse(msg.data);
      dispatch(action);
    },
  });

  const submit = (cards) => {
    return sendJsonMessage({
      cards,
    });
  };

  return (
    <>
      <div data-testid="room-code">room code: {id}</div>
      <Game state={state} submit={submit} />
    </>
  );
}
