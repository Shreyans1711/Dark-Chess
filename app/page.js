"use client";
import React, { useState, useEffect, useRef } from "react";
import { createBoardData, getAllMoves } from "../Utilityfunctions";
import Image from "next/image";

const pieces = {
  bb: "/assets/bb.png",
  br: "/assets/br.png",
  bn: "/assets/bn.png",
  bq: "/assets/bq.png",
  bk: "/assets/bk.png",
  bp: "/assets/bp.png",
  wb: "/assets/wb.png",
  wr: "/assets/wr.png",
  wn: "/assets/wn.png",
  wq: "/assets/wq.png",
  wk: "/assets/wk.png",
  wp: "/assets/wp.png",
};

let AllMovesTillNow = [];

export default function Home() {
  const [chessBoard, setChessBoard] = useState(createBoardData());
  const [draggedInfo, setDraggedInfo] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [lastMove, setlastMove] = useState({initialRow : null, initialCol : null, finalRow : null, finalCol : null});

  // Finding all Possible moves in the position for the current turn player
  const movesPossible = useRef(getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow));
  const isCurrentPlayerPiece = (piece) => {
    if (!piece) return false;  // Check if piece exists
    const pieceStr = piece.piece || piece; // If piece is an object, use its 'piece' property as a string
    return pieceStr.startsWith(currentTurn === "w" ? "w" : "b");
  };
  
  useEffect(() => {
    movesPossible.current = getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow);
    console.log(movesPossible.current)
  }, [chessBoard, currentTurn]);
  const handleDragStart = (row, col) => {
    const piece = chessBoard[row][col];
    if (!isCurrentPlayerPiece(piece)) return;
    setDraggedInfo({ piece, position: { row, col } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleCapture = (row, col, newBoard) => {
    newBoard[row][col].piece = null;
  }
  const handleMove = (piece, position, targetRow, targetCol) => {
    const newBoard = [...chessBoard];
    let movingPiece = null;
    if (newBoard[position.row][position.col].piece) {
      console.log(piece)
      movingPiece = piece.piece;
      handleCapture(position.row, position.col, newBoard);
      console.log(piece)
    }
    if (newBoard[targetRow][targetCol].piece) {
      handleCapture(targetRow, targetCol, newBoard);
    } else {
      console.log('Hi')
      if (movingPiece[1] === 'p' && Math.abs(targetRow - position.row) === 1 && Math.abs(targetCol - position.col) === 1) {
        handleCapture(position.row, targetCol, newBoard);
      } else if (movingPiece[1] === 'k' && Math.abs(targetCol - position.col) === 2) {
        if (targetCol === 6) {
          handleCapture(position.row, 7, newBoard);
          newBoard[position.row][5] = {piece : currentTurn + "r", file: String.fromCharCode(97 + 5), rank: 8 - targetRow}
        } else if (targetCol === 2) {
          handleCapture(position.row, 0, newBoard);
          newBoard[position.row][3] = {piece : currentTurn + "r", file: String.fromCharCode(97 + 3), rank: 8 - targetRow}
        }
      }
    }
    console.log(piece)
    newBoard[targetRow][targetCol].piece = movingPiece;
    setChessBoard(newBoard);
    setDraggedInfo(null);
    setCurrentTurn(currentTurn === "w" ? "b" : "w");
  }
  const handleDrop = (targetRow, targetCol) => {
    if (!draggedInfo) return;
    const { piece, position } = draggedInfo;
    if (position.row === targetRow && position.col === targetCol) return;
    
    const key = `${piece.piece}_${position.row}_${position.col}`;
    console.log(key)
    const validMove = movesPossible.current[key]?.find((move) => {
      return move[0] === targetRow && move[1] === targetCol;
    });
    
    if (!validMove) return;
    console.log(piece)
    setlastMove({initialRow : position.row, initialCol : position.col, finalRow : targetRow, finalCol : targetCol});
    AllMovesTillNow.push({
      piece: piece.piece,
      id : piece.id,
      initialRow: position.row,
      initialCol: position.col,
      finalRow: targetRow,
      finalCol: targetCol,
    });
    console.log(piece)
    handleMove(piece, position, targetRow, targetCol);
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
