import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import './spritesheet.css';

function App() {
  const [board, setBoard] = useState([{"number":"ONE","color":"BLUE","shading":"EMPTY","shape":"DIAMOND"},{"number":"TWO","color":"GREEN","shading":"STRIPED","shape":"SQUIGGLE"},{"number":"THREE","color":"BLUE","shading":"SOLID","shape":"OVAL"},{"number":"TWO","color":"RED","shading":"SOLID","shape":"DIAMOND"},{"number":"ONE","color":"BLUE","shading":"EMPTY","shape":"OVAL"},{"number":"ONE","color":"GREEN","shading":"EMPTY","shape":"DIAMOND"},{"number":"ONE","color":"GREEN","shading":"EMPTY","shape":"SQUIGGLE"},{"number":"THREE","color":"BLUE","shading":"STRIPED","shape":"OVAL"},{"number":"TWO","color":"BLUE","shading":"EMPTY","shape":"DIAMOND"},{"number":"ONE","color":"RED","shading":"STRIPED","shape":"DIAMOND"},{"number":"THREE","color":"GREEN","shading":"SOLID","shape":"DIAMOND"},{"number":"THREE","color":"RED","shading":"STRIPED","shape":"OVAL"}])

  return (
    <>
      {board.map(Card)}
    </>
  );
}

function Card({number, color, shading, shape}) {

  const spriteName = [number, color, shading, shape]
    .map(x => x.toLowerCase())
    .join('-') + (number == 'ONE' ? '' : 's'); 

  return (
    <div className={`card -${spriteName}`} key={spriteName} />
  )
}

export default App;
