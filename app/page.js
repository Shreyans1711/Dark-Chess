"use client";
import React, { useState } from "react";
import {createBoardData} from "../Utilityfunctions"

export default function Home() {
  const [chessBoard, setChessBoard] = useState(createBoardData());
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [draggedPos, setDraggedPos] = useState(null);

  // Handle the drag start
  const handleDragStart = (row, col) => {
    setDraggedPiece(chessBoard[row][col].piece);
    setDraggedPos({ row, col });
  };

  // Handle dragging over a square (allow drop)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle the drop event
  const handleDrop = (e, targetRow, targetCol) => {
    if (draggedPos.row === targetRow && draggedPos.col === targetCol) return;
    const newBoard = [...chessBoard];
    newBoard[draggedPos.row][draggedPos.col].piece = null;
    newBoard[targetRow][targetCol].piece = draggedPiece;
    setChessBoard(newBoard);
    setDraggedPiece(null);
    setDraggedPos(null);
  };

  const renderBoard = () =>
    chessBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (<div key={`${rowIndex}-${colIndex}`} className={`chess-square ${(rowIndex + colIndex) % 2 === 1 ? "bg-[#739552]" : "bg-[#ebecd0]"} w-[5rem] h-[5rem] flex justify-center items-end relative`} onDragOver={handleDragOver} onDrop={(e) => handleDrop(e, rowIndex, colIndex)}>
          {rowIndex === 7 && (<div className={`mb-1 absolute bottom-0 right-2 ${(rowIndex + colIndex) % 2 === 0 ? "text-[#739552]" : "text-[#ebecd0]"}`}>
            {cell.file}
          </div>
          )}
          {colIndex === 0 && (<div className={`mb-1 absolute top-1 left-1 ${(rowIndex + colIndex) % 2 === 0 ? "text-[#739552]" : "text-[#ebecd0]"}`}>
            {cell.rank}
          </div>
          )}
          {cell.piece && (
            <div draggable onDragStart={() => handleDragStart(rowIndex, colIndex)} className="cursor-move">
              {cell.piece}
            </div>
          )}
        </div>
        ))}
      </div>
    ));
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>{renderBoard()}</div>
      <button onClick={() => { setChessBoard(createBoardData()) }} className="bg-white text-black rounded-xl gap-10">Restart</button>
    </div>
  );
}
