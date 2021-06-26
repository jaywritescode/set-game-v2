import React, { useEffect, useReducer, useState } from 'react';
import _ from 'lodash';
import produce from 'immer';
import useWebSocket from 'react-use-websocket';

import Game, { spriteName } from './Game';

const socketUrl = 'ws://0.0.0.0:8899/ws';

export default function Room(props) {
  const { id } = props;

  const initialState = {
    board: [],
    gameOver: false,
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
          draft.gameOver = action.payload['game_over'];
        })(state);
      }
      default: {
        console.error('No type found for action: %O', action);
      }
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(async () => {
    const response = await fetch(`/api/${id}/start`);
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

  const findSet = async () => {
    const response = await fetch(`http://localhost:8080/api/${id}/find`);
    const json = await response.json();
    console.log(json.map(spriteName));
  };

  return (
    <>
      <div data-testid="room-code">room code: {id}</div>
      <Game board={state.board} submit={submit} />
      {state.gameOver && 'game over'}
      <button onClick={findSet}>find a set</button>
    </>
  );
}
