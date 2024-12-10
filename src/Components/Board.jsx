import React from 'react';
import Tiles from './Tiles';

const rows = 8;
const cols = 8;
const array = [];

const CreateTheBoard = () => {
  for (let i = 0; i < rows; i++) {
    array[i] = [];
    for (let j = 0; j < cols; j++) {
      array[i][j] = <Tiles key={`${i}-${j}`} r={i} c={j} />;
    }
  }
};
const Board = () => {
  CreateTheBoard();
  console.log(array)
  return (
    <div className="grid grid-cols-8 w-[16rem] sm:w-[32rem] h-[16rem] sm:h-[32rem]">
      {array.flat()}
    </div>
  );
};

export default Board;
