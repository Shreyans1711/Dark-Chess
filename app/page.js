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
  const [chessBoard, setChessBoard] = useState(createBoardData());
  const [draggedInfo, setDraggedInfo] = useState(null);
  const [currentTurn, setCurrentTurn] = useState("w");
  const [lastMove, setlastMove] = useState({ initialRow: null, initialCol: null, finalRow: null, finalCol: null });
  const [prom, setprom] = useState(false);
  const [promotedPiece, setpromotedPiece] = useState(null);
  const [result, setresult] = useState(null);
  const [isGameStarted, setIsGameStarted] = useState(false);

  // Chess clock states
  const [whiteTime, setWhiteTime] = useState(600); // 10 minutes in seconds
  const [blackTime, setBlackTime] = useState(600);
  const timerRef = useRef();

  const movesPossible = useRef(getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow));

  useEffect(() => {
    if (!isGameStarted) return; // Skip updating moves if the game hasn't started
    movesPossible.current = getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow);
    const kingSquare = kingsPosition(chessBoard, currentTurn);

    if (
      Object.keys(movesPossible.current).length === 1 &&
      movesPossible.current[currentTurn + "k_" + kingSquare.row + "_" + kingSquare.col].length === 0
    ) {
      if (isTheSquareSafe(kingSquare.row, kingSquare.col, chessBoard, currentTurn)) {
        setresult(currentTurn === "w" ? "b" : "w");
      }
    }

    if (Object.keys(movesPossible.current).length === 0) {
      setresult("d");
    }
  }, [chessBoard, currentTurn, isGameStarted]);

  useEffect(() => {
    if (promotedPiece) {
      handlePromotion(promotedPiece);
      setprom(false);
      setpromotedPiece(null);
    }
  }, [promotedPiece]);

  // Timer logic
  useEffect(() => {
    if (result || !isGameStarted) {
      clearInterval(timerRef.current); // Stop timer if game ends or hasn't started
      return;
    }

    timerRef.current = setInterval(() => {
      if (currentTurn === "w") {
        setWhiteTime((prev) => {
          if (prev <= 0) {
            setresult("b"); // Black wins if white runs out of time
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 0) {
            setresult("w"); // White wins if black runs out of time
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [currentTurn, result, isGameStarted]);

  const isCurrentPlayerPiece = (piece) => {
    if (!piece) return false;
    const pieceStr = piece.piece || piece;
    return pieceStr.startsWith(currentTurn === "w" ? "w" : "b");
  };

  const handleDragStart = (row, col) => {
    if (!isGameStarted) return; // Prevent moving if the game hasn't started
    const piece = chessBoard[row][col];
    if (!isCurrentPlayerPiece(piece)) return;
    setDraggedInfo({ piece, position: { row, col } });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleCapture = (row, col, newBoard) => {
    newBoard[row][col].piece = null;
  };

  const handleMove = (piece, position, targetRow, targetCol) => {
    const newBoard = [...chessBoard];
    let movingPiece = null;

    if (newBoard[position.row][position.col].piece) {
      movingPiece = piece.piece;
      handleCapture(position.row, position.col, newBoard);
    }

    if (newBoard[targetRow][targetCol].piece) {
      handleCapture(targetRow, targetCol, newBoard);
    } else if (movingPiece[1] === "p" && Math.abs(targetRow - position.row) === 1 && Math.abs(targetCol - position.col) === 1) {
      handleCapture(position.row, targetCol, newBoard);
    }

    if (movingPiece[1] === "p" && (targetRow === 0 || targetRow === 7)) {
      setprom(true);
      setlastMove({ initialRow: position.row, initialCol: position.col, finalRow: targetRow, finalCol: targetCol });
    } else {
      if (movingPiece[1] === "k" && Math.abs(targetCol - position.col) === 2) {
        if (targetCol === 6) {
          handleCapture(position.row, 7, newBoard);
          newBoard[position.row][5] = { piece: currentTurn + "r", file: String.fromCharCode(97 + 5), rank: 8 - targetRow };
        } else if (targetCol === 2) {
          handleCapture(position.row, 0, newBoard);
          newBoard[position.row][3] = { piece: currentTurn + "r", file: String.fromCharCode(97 + 3), rank: 8 - targetRow };
        }
      }
      newBoard[targetRow][targetCol].piece = movingPiece;
      setChessBoard(newBoard);
      setDraggedInfo(null);
      setCurrentTurn(currentTurn === "w" ? "b" : "w");
    }
  };

  const handlePromotion = (pieceType) => {
    const newBoard = [...chessBoard];
    const { finalRow, finalCol } = lastMove;

    if (finalRow !== null && finalCol !== null) {
      newBoard[finalRow][finalCol].piece = currentTurn + pieceType;
      setChessBoard(newBoard);
      setCurrentTurn(currentTurn === "w" ? "b" : "w");
    }
  };

  const handleDrop = (targetRow, targetCol) => {
    if (!isGameStarted || !draggedInfo) return; // Prevent dropping if game hasn't started
    const { piece, position } = draggedInfo;
    if (position.row === targetRow && position.col === targetCol) return;

    const key = `${piece.piece}_${position.row}_${position.col}`;
    const validMove = movesPossible.current[key]?.find((move) => {
      return move[0] === targetRow && move[1] === targetCol;
    });

    if (!validMove) return;
    setlastMove({ initialRow: position.row, initialCol: position.col, finalRow: targetRow, finalCol: targetCol });
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
            {cell.piece && pieces[cell.piece] && (
              <div draggable onDragStart={() => handleDragStart(rowIndex, colIndex)} className="cursor-pointer">
                <Image src={pieces[cell.piece]} alt={cell.piece[0]} fill={true} />
              </div>
            )}
          </div>
        ))}
      </div>
    ));

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center gap-10">
      {!isGameStarted && (
        <button
          onClick={() => setIsGameStarted(true)}
          className="text-gray-900 bg-gradient-to-r from-green-200 via-green-300 to-blue-200 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Start Game
        </button>
      )}
      {isGameStarted && result === null && <div>{renderBoard()}</div>}
      {isGameStarted && result === null && (
        <div className="flex justify-between w flex-col gap-10">
          <div className="text-lg font-bold bg-black">White: {formatTime(whiteTime)}</div>
          <div className="text-lg font-bold bg-black">Black: {formatTime(blackTime)}</div>
        </div>
      )}
      {result === "d" && <Stalemate />}
      {(result === "w" || result === "b") && <CheckMate result={result} />}
      {isGameStarted && <button
        onClick={() => {
          setChessBoard(createBoardData());
          setCurrentTurn("w");
          AllMovesTillNow = [];
          setresult(null);
          setWhiteTime(600); // Reset time
          setBlackTime(600);
          setIsGameStarted(false);
        }}
        className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5"
      >
        New Game
      </button>}
      {prom && (
        <div>
          {["q", "r", "b", "n"].map((piece) => (
            <button key={piece} onClick={() => setpromotedPiece(piece)}>
              <img src={`/assets/${currentTurn}${piece}.png`} alt={piece} width={50} height={50} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
