"use client";
import React, { useState } from "react";
import { showPiece } from "../Utilityfunctions";

export default function Home() {
  const createBoard = () => {
      const board = [];
      for (let row = 0; row < 8; row++) {
      const currentRow = [];
      for (let col = 0; col < 8; col++) {
          let rank = row + 1;
          let file = String.fromCharCode(97 + col);
          currentRow.push(
              <div key={8 * row + col} className={`chess-square ${   (col + row) % 2 === 1 ? "bg-[#739552]" : "bg-[#ebecd0]" } w-[5rem] h-[5rem] flex justify-center items-end relative`}>
                {row === 7 && 
                <div className={`mb-1 absolute bottom-0 right-2 ${(col + row) % 2 === 0 ? "text-[#739552]" : "text-[#ebecd0]"}`}>
                    {file}
                </div>
                }
                {col === 0 && 
                <div className={`mb-1 absolute top-1 left-1 ${  (col + row) % 2 === 0 ? "text-[#739552]" : "text-[#ebecd0]"}`}>
                    {rank}
                </div>
                }
                {showPiece(row, col)}
              </div>
          );
      }
      board.push(
          <div key={row} className="flex">
          {currentRow}
          </div>
      );
      }
    return board;
};
  const [chessBoard, setChessBoard] = useState(createBoard());
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>{chessBoard}</div>
    </div>
  );
}
