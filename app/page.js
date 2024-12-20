"use client";
import React, { useState } from "react";
import { createBoardData } from "../Utilityfunctions";
import Image from "next/image";

// Define piece images mapping
const pieces = {
  "bb": "/assets/bb.png",
  "br": "/assets/br.png",
  "bn": "/assets/bn.png",
  "bq": "/assets/bq.png",
  "bk": "/assets/bk.png",
  "bp": "/assets/bp.png",
  "wb": "/assets/wb.png",
  "wr": "/assets/wr.png",
  "wn": "/assets/wn.png",
  "wq": "/assets/wq.png",
  "wk": "/assets/wk.png",
  "wp": "/assets/wp.png",
};

export default function Home() {
  // State for the chessboard and game control
  const [chessBoard, setChessBoard] = useState(createBoardData());
  const [draggedInfo, setDraggedInfo] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("white");

  // Check if the piece belongs to the current player
  const isCurrentPlayerPiece = (piece) => {
    return piece && piece[0] === (currentTurn === "white" ? "w" : "b");
  };

  // Handle the start of dragging a piece
  const handleDragStart = (row, col) => {
    const piece = chessBoard[row][col].piece;
    if (!isCurrentPlayerPiece(piece)) return;
    setDraggedInfo({ piece, position: { row, col } });
  };

  // Allow drop by preventing default behavior
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle dropping a piece
  const handleDrop = (targetRow, targetCol) => {
    if (!draggedInfo) return;
    const { piece, position } = draggedInfo;

    // Avoid dropping onto the same square
    if (position.row === targetRow && position.col === targetCol) return;

    // Update the board state
    const newBoard = [...chessBoard];
    newBoard[position.row][position.col].piece = null;
    newBoard[targetRow][targetCol].piece = piece;
    setChessBoard(newBoard);
    setDraggedInfo(null);

    // Switch the current turn
    setCurrentTurn(currentTurn === "white" ? "black" : "white");
  };

  // Render the chessboard
  const renderBoard = () =>
    chessBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className={`chess-square ${(rowIndex + colIndex) % 2 === 1 ? "bg-[#739552]" : "bg-[#ebecd0]"} w-[5rem] h-[5rem] flex justify-center items-end relative`} onDragOver={handleDragOver} onDrop={() => handleDrop(rowIndex, colIndex)}>
            {rowIndex === 7 && (
              <div className={`mb-1 absolute bottom-0 right-2 ${(rowIndex + colIndex) % 2 === 0 ? "text-[#739552]" : "text-[#ebecd0]"}`}>
                {cell.file}
              </div>
            )}
            {colIndex === 0 && (
              <div className={`mb-1 absolute top-1 left-1 ${(rowIndex + colIndex) % 2 === 0 ? "text-[#739552]" : "text-[#ebecd0]"}`}>
                {cell.rank}
              </div>
            )}
            {cell.piece && (
              <div draggable onDragStart={() => handleDragStart(rowIndex, colIndex)} className="cursor-pointer">
                <Image src={pieces[cell.piece]} alt={cell.alternate} fill={true} />
              </div>
            )}
          </div>
        ))}
      </div>
    ));

  return (
    <div className="w-screen h-screen flex justify-center items-center gap-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Current Turn: {currentTurn.toUpperCase()}
        </h2>
        {renderBoard()}
      </div>
      <button onClick={() => {setChessBoard(createBoardData());setCurrentTurn("white");}} type="button" className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
        New Game
      </button>
    </div>
  );
}
