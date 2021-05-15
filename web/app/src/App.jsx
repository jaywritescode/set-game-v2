import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import produce from 'immer';
import classnames from 'classnames';

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
  const [board, setBoard] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(async () => {
    const response = await fetch('/start');
    const result = await response.json();
    setBoard(result);
  }, []);

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
  return <div className={classnames('card', `-${name}`, { selected: isSelected })} onClick={handleClick} />;
}

export default App;
