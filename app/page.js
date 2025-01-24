"use client";
import React, { useState, useEffect, useRef } from "react";
import { createBoardData, getAllMoves, isTheSquareSafe } from "../Utilityfunctions";
import Image from "next/image";
import { kingsPosition } from "@/Pieces/King/King";
import Stalemate from "@/Concepts/Stalemate";
import CheckMate from "@/Concepts/CheckMate";

// Object holding paths to chess piece images
const pieces = {
  bb: "/assets/bb.png", // Black Bishop
  br: "/assets/br.png", // Black Rook
  bn: "/assets/bn.png", // Black Knight
  bq: "/assets/bq.png", // Black Queen
  bk: "/assets/bk.png", // Black King
  bp: "/assets/bp.png", // Black Pawn
  wb: "/assets/wb.png", // White Bishop
  wr: "/assets/wr.png", // White Rook
  wn: "/assets/wn.png", // White Knight
  wq: "/assets/wq.png", // White Queen
  wk: "/assets/wk.png", // White King
  wp: "/assets/wp.png", // White Pawn
};

// Array to store the history of all moves made in the game
let AllMovesTillNow = [];

export default function Home() {
  // State to store the chessboard layout
  const [chessBoard, setChessBoard] = useState(createBoardData());
  const [draggedInfo, setDraggedInfo] = useState(null); // Info about the dragged piece
  const [currentTurn, setCurrentTurn] = useState("w"); // Keeps track of the current player's turn
  const [lastMove, setlastMove] = useState({
    initialRow: null,
    initialCol: null,
    finalRow: null,
    finalCol: null,
  }); // Tracks the last move made
  const [prom, setprom] = useState(false); // Determines if a pawn promotion is active
  const [promotedPiece, setpromotedPiece] = useState(null); // Stores the promoted piece type
  const [result, setresult] = useState(null); // Stores the result of the game (e.g., stalemate, checkmate)
  const [isGameStarted, setIsGameStarted] = useState(false); // Tracks if the game has started

  // Timer states for white and black players (10 minutes each)
  const [whiteTime, setWhiteTime] = useState(600);
  const [blackTime, setBlackTime] = useState(600);
  const timerRef = useRef(); // Reference for the game timer

  // Reference to the list of all valid moves for the current turn
  const movesPossible = useRef(getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow));

  // Effect to update possible moves and check for game-ending conditions
  useEffect(() => {
    if (!isGameStarted) return; // Skip if game hasn't started
    movesPossible.current = getAllMoves(chessBoard, currentTurn, lastMove, AllMovesTillNow);
    const kingSquare = kingsPosition(chessBoard, currentTurn);

    // Check for checkmate or stalemate conditions
    if (
      Object.keys(movesPossible.current).length === 1 &&
      movesPossible.current[currentTurn + "k_" + kingSquare.row + "_" + kingSquare.col].length === 0
    ) {
      if (isTheSquareSafe(kingSquare.row, kingSquare.col, chessBoard, currentTurn)) {
        setresult(currentTurn === "w" ? "b" : "w"); // Opponent wins if no valid moves
      }
    }

    // Check for stalemate (no moves for any piece)
    if (Object.keys(movesPossible.current).length === 0) {
      setresult("d"); // Draw
    }
  }, [chessBoard, currentTurn, isGameStarted]);

  // Effect to handle pawn promotion
  useEffect(() => {
    if (promotedPiece) {
      handlePromotion(promotedPiece); // Promote the pawn
      setprom(false);
      setpromotedPiece(null);
    }
  }, [promotedPiece]);

  // Timer logic for switching turns and checking timeouts
  useEffect(() => {
    if (result || !isGameStarted) {
      clearInterval(timerRef.current); // Stop the timer if the game ends
      return;
    }

    timerRef.current = setInterval(() => {
      if (currentTurn === "w") {
        setWhiteTime((prev) => {
          if (prev <= 0) {
            setresult("b"); // Black wins if white's time runs out
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      } else {
        setBlackTime((prev) => {
          if (prev <= 0) {
            setresult("w"); // White wins if black's time runs out
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000); // Timer updates every second

    return () => clearInterval(timerRef.current); // Cleanup on unmount
  }, [currentTurn, result, isGameStarted]);

  // Check if the piece belongs to the current player
  const isCurrentPlayerPiece = (piece) => {
    if (!piece) return false;
    const pieceStr = piece.piece || piece;
    return pieceStr.startsWith(currentTurn === "w" ? "w" : "b");
  };

  // Handles the start of dragging a piece
  const handleDragStart = (row, col) => {
    if (!isGameStarted) return; // Prevent dragging if game hasn't started
    const piece = chessBoard[row][col];
    if (!isCurrentPlayerPiece(piece)) return; // Only allow dragging the current player's pieces
    setDraggedInfo({ piece, position: { row, col } });
  };

  // Prevents default behavior while dragging over a square
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handles capturing a piece on the target square
  const handleCapture = (row, col, newBoard) => {
    newBoard[row][col].piece = null;
  };

  // Handles moving a piece from one square to another
  const handleMove = (piece, position, targetRow, targetCol) => {
    const newBoard = [...chessBoard];
    let movingPiece = null;

    // Handle capturing the piece from the initial position
    if (newBoard[position.row][position.col].piece) {
      movingPiece = piece.piece;
      handleCapture(position.row, position.col, newBoard);
    }

    // Handle capturing the target square's piece
    if (newBoard[targetRow][targetCol].piece) {
      handleCapture(targetRow, targetCol, newBoard);
    } else if (movingPiece[1] === "p" && Math.abs(targetRow - position.row) === 1 && Math.abs(targetCol - position.col) === 1) {
      // Handle en passant capture
      handleCapture(position.row, targetCol, newBoard);
    }

    // Check for pawn promotion
    if (movingPiece[1] === "p" && (targetRow === 0 || targetRow === 7)) {
      setprom(true); // Trigger promotion modal
      setlastMove({ initialRow: position.row, initialCol: position.col, finalRow: targetRow, finalCol: targetCol });
    } else {
      // Handle castling
      if (movingPiece[1] === "k" && Math.abs(targetCol - position.col) === 2) {
        if (targetCol === 6) {
          // Kingside castling
          handleCapture(position.row, 7, newBoard);
          newBoard[position.row][5] = { piece: currentTurn + "r", file: String.fromCharCode(97 + 5), rank: 8 - targetRow };
        } else if (targetCol === 2) {
          // Queenside castling
          handleCapture(position.row, 0, newBoard);
          newBoard[position.row][3] = { piece: currentTurn + "r", file: String.fromCharCode(97 + 3), rank: 8 - targetRow };
        }
      }
      // Update the board with the moving piece
      newBoard[targetRow][targetCol].piece = movingPiece;
      setChessBoard(newBoard);
      setDraggedInfo(null);
      setCurrentTurn(currentTurn === "w" ? "b" : "w"); // Switch turns
    }
  };

  // Handles pawn promotion by replacing the piece
  const handlePromotion = (pieceType) => {
    const newBoard = [...chessBoard];
    const { finalRow, finalCol } = lastMove;

    if (finalRow !== null && finalCol !== null) {
      newBoard[finalRow][finalCol].piece = currentTurn + pieceType; // Promote to the chosen piece
      setChessBoard(newBoard);
      setCurrentTurn(currentTurn === "w" ? "b" : "w"); // Switch turns
    }
  };

  // Handles dropping the piece onto a square
  const handleDrop = (targetRow, targetCol) => {
    if (!isGameStarted || !draggedInfo) return; // Prevent dropping if game hasn't started
    const { piece, position } = draggedInfo;
    if (position.row === targetRow && position.col === targetCol) return; // No move if dropped on the same square

    const key = `${piece.piece}_${position.row}_${position.col}`;
    const validMove = movesPossible.current[key]?.find((move) => {
      return move[0] === targetRow && move[1] === targetCol;
    });

    if (!validMove) return; // Ignore invalid moves
    setlastMove({ initialRow: position.row, initialCol: position.col, finalRow: targetRow, finalCol: targetCol });
    handleMove(piece, position, targetRow, targetCol); // Execute the move
    let cntOfPieces = 0;

    for (let r = 0;r < 8;r++) {
      for (let c = 0;c < 8;c++) {
        if (chessBoard[r][c] && chessBoard[r][c].piece) cntOfPieces++;
      }
    }
    AllMovesTillNow.push({ // push_back in the All moves array
      piece: piece.piece,
      id: piece.id,
      initialRow: position.row,
      initialCol: position.col,
      finalRow: targetRow,
      finalCol: targetCol,
      cntOfPieces:cntOfPieces,
    });
    
    if (AllMovesTillNow.length >= 100) {
      let move = AllMovesTillNow.length - 1;
      let counter = 100;
      let is50MoveRule = true;
      let cntOfPiecesFromStart = AllMovesTillNow[move].cntOfPieces;
      while (counter > 0) {
        if(AllMovesTillNow[move].piece[1] === 'p') {
          is50MoveRule = false;
          break;
        }
        if (AllMovesTillNow[move].cntOfPieces != cntOfPiecesFromStart) {
          is50MoveRule = false;
          break;
        }
        move--;
        counter--;
      }

      if (is50MoveRule) {
        setresult('d');
      }
    }
  };

  // Renders the chessboard
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
            {cell.piece && pieces[cell.piece] && (
              <div draggable onDragStart={() => handleDragStart(rowIndex, colIndex)} className="cursor-pointer">
                <Image src={pieces[cell.piece]} alt={cell.piece[0]} fill={true} />
              </div>
            )}
          </div>
        ))}
      </div>
    ));

  // Formats the time for display (MM:SS)
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="w-screen h-screen flex flex-row justify-center items-center gap-10">
      {/* Game start button */}
      {!isGameStarted && (
        <button
          onClick={() => setIsGameStarted(true)}
          className="text-gray-900 bg-gradient-to-r from-green-200 via-green-300 to-blue-200 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5"
        >
          Start Game
        </button>
      )}

      {/* Chessboard and timer display */}
      {isGameStarted && result === null && <div>{renderBoard()}</div>}
      {isGameStarted && result === null && (
        <div className="flex justify-between w flex-col gap-10">
          <div className="text-lg font-bold bg-black">Black: {formatTime(blackTime)}</div>
          <div className="text-lg font-bold bg-black">White: {formatTime(whiteTime)}</div>
        </div>
      )}

      {/* Display for stalemate or checkmate */}
      {result === "d" && <Stalemate />}
      {(result === "w" || result === "b") && <CheckMate result={result} />}

      {/* Button to reset the game */}
      {isGameStarted && (
        <button
          onClick={() => {
            setChessBoard(createBoardData()); // Reset chessboard
            setCurrentTurn("w"); // Reset turn to white
            AllMovesTillNow = []; // Clear move history
            setresult(null); // Reset result
            setWhiteTime(600); // Reset timers
            setBlackTime(600);
            setIsGameStarted(false); // Mark game as not started
          }}
          className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl font-medium rounded-lg text-sm px-5 py-2.5"
        >
          New Game
        </button>
      )}

      {/* Promotion modal */}
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
