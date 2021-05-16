import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import produce from 'immer';
import classnames from 'classnames';

import logo from './logo.svg';
import './App.css';
import './spritesheet.css';

const attrs = {
  number: { ONE: 0, TWO: 1, THREE: 2 },
  color: { RED: 0, BLUE: 1, GREEN: 2 },
  shading: { EMPTY: 0, STRIPED: 1, SOLID: 2 },
  shape: { DIAMOND: 0, OVAL: 1, SQUIGGLE: 2 },
};

const spriteName = ({ number, color, shading, shape }) => {
  const name = [number, color, shading, shape]
    .map((x) => x.toLowerCase())
    .join('-');
  return number == 'ONE' ? name : `${name}s`;
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

function App() {
  const [board, setBoard] = useState([]);
  useEffect(async () => {
    const response = await fetch('/start');
    const result = await response.json();
    setBoard(result);
  }, []);

  const [selected, setSelected] = useState([]);
  useEffect(async () => {
    if (isSet(selected)) {
      const response = await fetch('/submit', {
        method: 'PUT',
        cache: 'no-cache',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selected),
      });
      console.log(response);  
    }

    if (selected.length == 3) {
      setSelected([]);
    }
  }, [selected]);


  const onSelectCard = (card) => {
    if (isSelected(card)) {
      setSelected(produce((draft) => _.reject(draft, card)));
      return;
    }

    setSelected(produce((draft) => draft.concat(card)));
  }



  const isSelected = (card) => _.find(selected, card);



  return (
    <div className="container">
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

export default App;
