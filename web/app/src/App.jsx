import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import produce from 'immer';

import logo from './logo.svg';
import './App.css';
import './spritesheet.css';

const spriteName = ({ number, color, shading, shape }) => {
  const name = [number, color, shading, shape]
    .map((x) => x.toLowerCase())
    .join('-');
  return number == 'ONE' ? name : `${name}s`;
};

function App() {
  const [board, setBoard] = useState([
    { number: 'ONE', color: 'BLUE', shading: 'EMPTY', shape: 'DIAMOND' },
    { number: 'TWO', color: 'GREEN', shading: 'STRIPED', shape: 'SQUIGGLE' },
    { number: 'THREE', color: 'BLUE', shading: 'SOLID', shape: 'OVAL' },
    { number: 'TWO', color: 'RED', shading: 'SOLID', shape: 'DIAMOND' },
    { number: 'ONE', color: 'BLUE', shading: 'EMPTY', shape: 'OVAL' },
    { number: 'ONE', color: 'GREEN', shading: 'EMPTY', shape: 'DIAMOND' },
    { number: 'ONE', color: 'GREEN', shading: 'EMPTY', shape: 'SQUIGGLE' },
    { number: 'THREE', color: 'BLUE', shading: 'STRIPED', shape: 'OVAL' },
    { number: 'TWO', color: 'BLUE', shading: 'EMPTY', shape: 'DIAMOND' },
    { number: 'ONE', color: 'RED', shading: 'STRIPED', shape: 'DIAMOND' },
    { number: 'THREE', color: 'GREEN', shading: 'SOLID', shape: 'DIAMOND' },
    { number: 'THREE', color: 'RED', shading: 'STRIPED', shape: 'OVAL' },
  ]);
  const [selected, setSelected] = useState([]);

  const onSelectCard = (card) => {
    if (_.find(selected, card)) {
      setSelected(
        produce((draft) => {
          _.reject(draft, card);
        }),
      );
    } else if (selected.length < 2) {
      setSelected(
        produce((draft) => {
          draft.push(card);
        }),
      );
      return;
    }

    setSelected([]);
  };

  return (
    <div className="container">
      {board.map((card) => {
        const name = spriteName(card);
        return (
          <Card
            name={name}
            key={name}
            handleClick={_.partial(onSelectCard, card)}
          />
        );
      })}
    </div>
  );
}

function Card(props) {
  const { name, handleClick } = props;
  return <div className={`card -${name}`} onClick={handleClick} />;
}

export default App;
