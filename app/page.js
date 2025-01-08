"use client";
import React, { useState, useEffect, useRef } from "react";
import { createBoardData, getAllMoves, isTheSquareSafe } from "../Utilityfunctions";
import Image from "next/image";
import { kingsPosition } from "@/Pieces/King/King";
import Stalemate from "@/Concepts/Stalemate";
import CheckMate from "@/Concepts/CheckMate";

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
  const [lastMove, setlastMove] = useState({ initialRow: null, initialCol: null, finalRow: null, finalCol: null });
  const [prom, setprom] = useState(false);
  const [promotedPiece, setpromotedPiece] = useState(null);
  const [result, setresult] = useState(null)

  // Finding all Possible moves in the position for the current turn player
  const movesPossible = useRef(getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow));

  const isCurrentPlayerPiece = (piece) => {
    if (!piece) return false;
    const pieceStr = piece.piece || piece;
    return pieceStr.startsWith(currentTurn === "w" ? "w" : "b");
  };

  useEffect(() => {
    movesPossible.current = getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow);
    const kingSquare = kingsPosition(chessBoard, currentTurn);

    console.log(currentTurn + 'k_' + kingSquare.row + '_' + kingSquare.col)
    console.log(movesPossible.current)

    if (Object.keys(movesPossible.current).length === 1 && movesPossible.current[currentTurn + 'k_' + kingSquare.row + '_' + kingSquare.col].length === 0) {
      console.log('Hi')
      if (isTheSquareSafe(kingSquare.row, kingSquare.col, chessBoard, currentTurn)) {
        setresult((currentTurn === 'w') ? 'b' : 'w');
      } 
    }
    if (Object.keys(movesPossible.current).length === 0) {
      setresult('d');
    }
  }, [chessBoard, currentTurn]);

  useEffect(() => {
    if (promotedPiece) {
      handlePromotion(promotedPiece);
      setprom(false); // Close the promotion modal
      setpromotedPiece(null); // Reset promotedPiece
    }
  }, [promotedPiece]);

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
    }

    // Pawn Promotion Logic
    if (movingPiece[1] === 'p' && (targetRow === 0 || targetRow === 7)) {
      setprom(true);
      setlastMove({ initialRow: position.row, initialCol: position.col, finalRow: targetRow, finalCol: targetCol });
    } else {
      if (movingPiece[1] === 'k' && Math.abs(targetCol - position.col) === 2) {
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
      newBoard[finalRow][finalCol].piece = currentTurn + pieceType; // Update pawn to promoted piece
      setChessBoard(newBoard);
      setCurrentTurn(currentTurn === "w" ? "b" : "w");
    }
  };

  const handleDrop = (targetRow, targetCol) => {
    if (!draggedInfo) return;
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

  return (
    <div className="w-screen h-screen flex justify-center items-center gap-10">
      { result === null && <div>{renderBoard()}</div>}
      {result === 'd' && 
        <Stalemate/>
      } 
      {
        (result === 'w' || result === 'b') && 
        <CheckMate result = {result}/>
      }
      <button
        onClick={() => {
          setChessBoard(createBoardData());
          setCurrentTurn("w");
          AllMovesTillNow = [];
          setresult(null)
        }}
        className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5"
      >
        New Game
      </button>
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
