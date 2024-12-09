import React from 'react';

const Tiles = ({ r, c }) => {
  const isBlack = (r + c) % 2 === 1;
  const letterForCol = String.fromCharCode(97 + c);
  return (
    <div
      className={`relative flex aspect-square items-center justify-center ${
        isBlack ? 'bg-black text-teal-50' : 'bg-teal-50 text-black'
      }`}
    >
    {(c === 0) && (
        <span
          className={`absolute top-1 left-1 text-[8px] sm:text-xs ${
            isBlack ? 'bg-black' : 'bg-teal-50'
          }`}
        >
          {8 - r}
        </span>
      )}

      {r === 7 && (
        <span
          className={`absolute bottom-1 right-1 text-[8px] sm:text-xs ${
            isBlack ? 'bg-black' : 'bg-teal-50'
          }`}
        >
          {letterForCol}
        </span>
      )}    </div>
  );
};

export default Tiles;
