import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import produce from 'immer';
import classnames from 'classnames';

import logo from './logo.svg';
import './Game.css';
import './spritesheet.css';

const attrs = {
  number: ['one', 'two', 'three'],
  color: ['red', 'blue', 'green'],
  shading: ['empty', 'striped', 'solid'],
  shape: ['diamond', 'oval', 'squiggle'],
};

const spriteName = ({ number, color, shading, shape }) => {
  const name = [number, color, shading, shape].join('-');
  return number == 'one' ? name : `${name}s`;
};

const toVector = (card) => {
  return Object.keys(attrs).map((attr) => attrs[attr][card[attr]]);
};

const isSet = (cards) => {
  if (cards.length != 3) {
    return false;
  }

  return _.zip(...cards.map(toVector)).every((arr) => _.sum(arr) % 3 == 0);
};

function Game(props) {
  const { room, sendJsonMessage } = props;

  const [board, setBoard] = useState([]);
  useEffect(async () => {
    const response = await fetch(`/api/start/${room}`);
    const result = await response.json();

    const board = result['game']['board'].map((card) =>
      _.mapValues(card, (value, key) => attrs[key][value]),
    );
    setBoard(board);
  }, []);

  const [selected, setSelected] = useState([]);
  useEffect(() => {
    if (isSet(selected)) {
      submit();
    }

    if (selected.length == 3) {
      setSelected([]);
    }
  });

  const onCardsDealt = ({ board }) => {
    setBoard(JSON.parse(board));
  };

  const submit = () => {
    console.log('submitting...');
    console.dir(selected);

    const msg = selected.map((obj) => Object.assign({ __card__: true }, obj));
    sendJsonMessage(JSON.stringify(msg));
  };

  const onSelectCard = (card) => {
    const fn = isSelected(card)
      ? (draft) => _.reject(draft, card)
      : (draft) => draft.concat(card);
    setSelected(produce(fn));
  };

  const isSelected = (card) => _.some(selected, card);

  return (
    <div className="board">
      {board.map((card) => {
        const name = spriteName(card);
        return (
          <Card
            name={name}
            key={name}
            isSelected={selected.some(_.matches(card))}
            handleClick={_.partial(onSelectCard, card)}
          />
        );
      })}
    </div>
  );
}

function Card(props) {
  const { name, isSelected, handleClick } = props;
  return (
    <div
      className={classnames('card', `-${name}`, { selected: isSelected })}
      onClick={handleClick}
    />
  );
}

export default Game;
