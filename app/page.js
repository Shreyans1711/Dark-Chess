"use client";
import React, { useState, useEffect, useRef } from "react";
import { createBoardData, getAllMoves, isTheSquareSafe } from "../Utilityfunctions";
import Image from "next/image";
import { kingsPosition } from "@/Pieces/King/King";
import Stalemate from "@/Concepts/Stalemate";
import CheckMate from "@/Concepts/CheckMate";

// Object holding image paths for chess pieces
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

// Array to keep track of all moves made in the game
let AllMovesTillNow = [];

export default function Home() {
  // State to manage the current chessboard data
  const [chessBoard, setChessBoard] = useState(createBoardData());
  const [draggedInfo, setDraggedInfo] = useState(null); // Info about the dragged piece
  const [currentTurn, setCurrentTurn] = useState("w"); // Current player's turn (white or black)
  const [lastMove, setlastMove] = useState({ initialRow: null, initialCol: null, finalRow: null, finalCol: null }); // Tracks the last move
  const [prom, setprom] = useState(false); // Tracks whether a pawn promotion is needed
  const [promotedPiece, setpromotedPiece] = useState(null); // Stores the piece chosen for promotion
  const [result, setresult] = useState(null); // Tracks the game's result ('w', 'b', or 'd')

  // Ref to store possible moves for optimization purposes
  const movesPossible = useRef(getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow));

  // Helper function to check if a piece belongs to the current player
  const isCurrentPlayerPiece = (piece) => {
    if (!piece) return false;
    const pieceStr = piece.piece || piece;
    return pieceStr.startsWith(currentTurn === "w" ? "w" : "b");
  };

  // useEffect to update possible moves and check for stalemate or checkmate after every move
  useEffect(() => {
    movesPossible.current = getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow);
    const kingSquare = kingsPosition(chessBoard, currentTurn);
    // Check for checkmate
    if (
      Object.keys(movesPossible.current).length === 1 &&
      movesPossible.current[currentTurn + 'k_' + kingSquare.row + '_' + kingSquare.col].length === 0
    ) {
      if (isTheSquareSafe(kingSquare.row, kingSquare.col, chessBoard, currentTurn)) {
        setresult(currentTurn === 'w' ? 'b' : 'w'); // Opponent wins
      }
    }

    // Check for stalemate
    if (Object.keys(movesPossible.current).length === 0) {
      setresult('d'); // Game is a draw
    }
  }, [chessBoard, currentTurn]);

  // useEffect to handle pawn promotion logic
  useEffect(() => {
    if (promotedPiece) {
      handlePromotion(promotedPiece);
      setprom(false); // Close the promotion modal
      setpromotedPiece(null); // Reset promotedPiece
    }
  }, [promotedPiece]);

  // Handle the start of a drag event
  const handleDragStart = (row, col) => {
    const piece = chessBoard[row][col];
    if (!isCurrentPlayerPiece(piece)) return; // Ignore if the piece is not owned by the current player
    setDraggedInfo({ piece, position: { row, col } });
  };

  // Allow drag-over events
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle capturing a piece on the target square
  const handleCapture = (row, col, newBoard) => {
    newBoard[row][col].piece = null; // Remove the piece from the target square
  };

  // Handle the actual movement of pieces
  const handleMove = (piece, position, targetRow, targetCol) => {
    const newBoard = [...chessBoard];
    let movingPiece = null;

    // Remove the piece from its initial position
    if (newBoard[position.row][position.col].piece) {
      movingPiece = piece.piece;
      handleCapture(position.row, position.col, newBoard);
    }

    // Capture the piece at the target square (if any)
    if (newBoard[targetRow][targetCol].piece) {
      handleCapture(targetRow, targetCol, newBoard);
    }else if (movingPiece[1] === 'p' && Math.abs(targetRow - position.row) === 1 && Math.abs(targetCol - position.col) === 1) {
      handleCapture(position.row, targetCol, newBoard);
    }

    // Pawn Promotion Logic
    if (movingPiece[1] === 'p' && (targetRow === 0 || targetRow === 7)) {
      setprom(true); // Open promotion modal
      setlastMove({ initialRow: position.row, initialCol: position.col, finalRow: targetRow, finalCol: targetCol });
    } else {
      // Handle castling logic
      if (movingPiece[1] === 'k' && Math.abs(targetCol - position.col) === 2) {
        if (targetCol === 6) {
          handleCapture(position.row, 7, newBoard); // Kingside rook
          newBoard[position.row][5] = { piece: currentTurn + "r", file: String.fromCharCode(97 + 5), rank: 8 - targetRow };
        } else if (targetCol === 2) {
          handleCapture(position.row, 0, newBoard); // Queenside rook
          newBoard[position.row][3] = { piece: currentTurn + "r", file: String.fromCharCode(97 + 3), rank: 8 - targetRow };
        }
      }
      newBoard[targetRow][targetCol].piece = movingPiece; // Place the moving piece on the target square
      setChessBoard(newBoard);
      setDraggedInfo(null);
      setCurrentTurn(currentTurn === "w" ? "b" : "w"); // Switch turn
    }
  };

  // Handle pawn promotion to a chosen piece
  const handlePromotion = (pieceType) => {
    const newBoard = [...chessBoard];
    const { finalRow, finalCol } = lastMove;

    if (finalRow !== null && finalCol !== null) {
      newBoard[finalRow][finalCol].piece = currentTurn + pieceType; // Update pawn to promoted piece
      setChessBoard(newBoard);
      setCurrentTurn(currentTurn === "w" ? "b" : "w");
    }
  };

  // Handle the drop of a piece onto a target square
  const handleDrop = (targetRow, targetCol) => {
    if (!draggedInfo) return;
    const { piece, position } = draggedInfo;
    if (position.row === targetRow && position.col === targetCol) return; // Ignore if no movement

    // Validate if the move is legal
    const key = `${piece.piece}_${position.row}_${position.col}`;
    const validMove = movesPossible.current[key]?.find((move) => {
      return move[0] === targetRow && move[1] === targetCol;
    });

    if (!validMove) return; // Ignore invalid moves
    setlastMove({ initialRow: position.row, initialCol: position.col, finalRow: targetRow, finalCol: targetCol }); // Update the last move
    // Add the move to AllMovesTillNow
    AllMovesTillNow.push({
      piece: piece.piece,
      id: piece.id,
      initialRow: position.row,
      initialCol: position.col,
      finalRow: targetRow,
      finalCol: targetCol,
    });
    handleMove(piece, position, targetRow, targetCol);
  };

  // Render the chessboard
  const renderBoard = () =>
    chessBoard.map((row, rowIndex) => (
      <div key={rowIndex} className="flex">
        {row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`chess-square ${(rowIndex + colIndex) % 2 === 1 ? "bg-[#739552]" : "bg-[#ebecd0]"} w-[5rem] h-[5rem] flex justify-center items-end relative`}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(rowIndex, colIndex)}
          >
            {cell.piece && pieces[cell.piece] && ( // Display pieces
              <div draggable onDragStart={() => handleDragStart(rowIndex, colIndex)} className="cursor-pointer">
                <Image src={pieces[cell.piece]} alt={cell.piece[0]} fill={true} />
              </div>
            )}
          </div>
        ))}
      </div>
    ));

  return (
    <div className="w-screen h-screen flex justify-center items-center gap-10">
      {result === null && <div>{renderBoard()}</div>} {/*if the game has no result*/}
      {result === 'd' && <Stalemate />} {/*if game is a draw*/}
      {(result === 'w' || result === 'b') && <CheckMate result={result} />} {/*game is a win*/}
      <button
        onClick={() => {
          setChessBoard(createBoardData());
          setCurrentTurn("w");
          AllMovesTillNow = [];
          setresult(null);
        }}
        className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5"
      >
        New Game
      </button>
      {/*promotion logic*/}
      {prom && (
        <div>
          {['q', 'r', 'b', 'n'].map((piece) => (
            <button key={piece} onClick={() => setpromotedPiece(piece)}>
              <img src={`/assets/${currentTurn}${piece}.png`} alt={piece} width={50} height={50} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
