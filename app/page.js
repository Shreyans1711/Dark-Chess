"use client";
import React, { useState, useEffect, useRef } from "react";
import { createBoardData, getAllMoves, getBishopMoves, getRookMoves, getQueenMoves, getKnightMoves, getPawnMoves } from "../Utilityfunctions";
import Image from "next/image";

const pieces = {
  bb1: "/assets/bb.png",
  bb2: "/assets/bb.png",
  br1: "/assets/br.png",
  br2: "/assets/br.png",
  bn1: "/assets/bn.png",
  bn2: "/assets/bn.png",
  bq: "/assets/bq.png",
  bk: "/assets/bk.png",
  bp1: "/assets/bp.png",
  bp2: "/assets/bp.png",
  bp3: "/assets/bp.png",
  bp4: "/assets/bp.png",
  bp5: "/assets/bp.png",
  bp6: "/assets/bp.png",
  bp7: "/assets/bp.png",
  bp8: "/assets/bp.png",
  wb1: "/assets/wb.png",
  wb2: "/assets/wb.png",
  wr1: "/assets/wr.png",
  wr2: "/assets/wr.png",
  wn1: "/assets/wn.png",
  wn2: "/assets/wn.png",
  wq: "/assets/wq.png",
  wk: "/assets/wk.png",
  wp1: "/assets/wp.png",
  wp2: "/assets/wp.png",
  wp3: "/assets/wp.png",
  wp4: "/assets/wp.png",
  wp5: "/assets/wp.png",
  wp6: "/assets/wp.png",
  wp7: "/assets/wp.png",
  wp8: "/assets/wp.png",
};

export default function Home() {
  const [chessBoard, setChessBoard] = useState(createBoardData());
  const [draggedInfo, setDraggedInfo] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [lastMove, setlastMove] = useState({initialRow : null, initialCol : null, finalRow : null, finalCol : null});
  const [check, setCheck] = useState(false)

  // Finding all Possible moves in the position for the current turn player
  const movesPossible = useRef(getAllMoves(chessBoard, currentTurn, lastMove));
  const isCurrentPlayerPiece = (piece) => {
    return piece && piece.startsWith(currentTurn === "w" ? "w" : "b");
  };
  useEffect(() => {
    movesPossible.current = getAllMoves(chessBoard, currentTurn, lastMove);
    console.log(movesPossible.current);
  }, [chessBoard, currentTurn]);

  const handleDragStart = (row, col) => {
    const piece = chessBoard[row][col].piece;
    if (!isCurrentPlayerPiece(piece)) return;
    setDraggedInfo({ piece, position: { row, col } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleCapture = (position, newBoard) => {
    newBoard[position.row][position.col].piece = null;
  }
  const handleMove = (piece, position, targetRow, targetCol) => {
    const newBoard = [...chessBoard];
    if (newBoard[position.row][position.col].piece) {
      handleCapture(position.row, position.col, newBoard);
    }
    if (newBoard[targetRow][targetCol].piece) {
      handleCapture(targetRow, targetCol, newBoard);
    } else {
      console.log('Hi')
      if (piece[1] === 'p' && Math.abs(targetRow - position.row) === 1 && Math.abs(targetCol - position.col) === 1) {
        handleCapture(position.row, targetCol, newBoard);
      }
    }
    newBoard[targetRow][targetCol].piece = piece;
    setChessBoard(newBoard);
    setDraggedInfo(null);
    setCurrentTurn(currentTurn === "w" ? "b" : "w");
  }
  const handleDrop = (targetRow, targetCol) => {
    if (!draggedInfo) return;
    const { piece, position } = draggedInfo;
    if (position.row === targetRow && position.col === targetCol) return;
    
    const key = `${piece}_${position.row}_${position.col}`;
    
    const validMove = movesPossible.current[key]?.find((move) => {
      return move[0] === targetRow && move[1] === targetCol;
    });
    if (!validMove) return;
    
    setlastMove({initialRow : position.row, initialCol : position.col, finalRow : targetRow, finalCol : targetCol});
    
  };

  const renderBoard = () =>
    chessBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`chess-square ${
              (rowIndex + colIndex) % 2 === 1 ? "bg-[#739552]" : "bg-[#ebecd0]"
            } w-[5rem] h-[5rem] flex justify-center items-end relative`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(rowIndex, colIndex)}
          >
            {rowIndex === 7 && (
              <div
                className={`mb-1 absolute bottom-0 right-2 ${
                  (rowIndex + colIndex) % 2 === 0
                    ? "text-[#739552]"
                    : "text-[#ebecd0]"
                }`}
              >
                {cell.file}
              </div>
            )}
            {colIndex === 0 && (
              <div
                className={`mb-1 absolute top-1 left-1 ${
                  (rowIndex + colIndex) % 2 === 0
                    ? "text-[#739552]"
                    : "text-[#ebecd0]"
                }`}
              >
                {cell.rank}
              </div>
            )}
            {cell.piece && pieces[cell.piece] && (
              <div
                draggable
                onDragStart={() => handleDragStart(rowIndex, colIndex)}
                className="cursor-pointer"
              >
                <Image
                  src={pieces[cell.piece]}
                  alt={cell.piece[0]}
                  fill={true}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    ));
  return (
    <div className="w-screen h-screen flex justify-center items-center gap-10">
      <div>{renderBoard()}</div>
      <button
        onClick={() => {
          setChessBoard(createBoardData());
          setCurrentTurn("w");
        }}
        type="button"
        className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        New Game
      </button>
    </div>
  );
}
