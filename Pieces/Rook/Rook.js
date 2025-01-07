import {isThePiecePinnedFromDiagonal, isThePiecePinnedFromLines} from "../../Concepts/Pinning"
import { kingsPosition } from "../King/King";

export const getRookMoves = (row, col, board,  currentPlayer) => {
  const moves = [];
  if (isThePiecePinnedFromDiagonal(board, row, col, currentPlayer)) {
    return moves;
  }
  if (isThePiecePinnedFromLines(board, row, col, currentPlayer)) {
    const kingSquare = kingsPosition(board, currentPlayer);
  
    // Horizontal Pin (Same Row as King)
    if (row === kingSquare.row) {
      if (col > kingSquare.col) {
        // Rook is to the right of the king
        for (let i = kingSquare.col + 1; i < 8; i++) {
          if (i === col) continue; // Skip the rook's own position
          if (board[row][i].piece) {
            break; // Stop if a piece blocks the path
          }
          moves.push([row, i]);
        }
      } else {
        // Rook is to the left of the king
        for (let i = kingSquare.col - 1; i >= 0; i--) {
          if (i === col) continue; // Skip the rook's own position
          if (board[row][i].piece) {
            break; // Stop if a piece blocks the path
          }
          moves.push([row, i]);
        }
      }
    } 
    
    // Vertical Pin (Same Column as King)
    else if (col === kingSquare.col) {
      if (row > kingSquare.row) {
        // Rook is below the king
        for (let i = kingSquare.row + 1; i < 8; i++) {
          if (i === row) continue; // Skip the rook's own position
          if (board[i][col].piece) {
            break; // Stop if a piece blocks the path
          }
          moves.push([i, col]);
        }
      } else {
        // Rook is above the king
        for (let i = kingSquare.row - 1; i >= 0; i--) {
          if (i === row) continue; // Skip the rook's own position
          if (board[i][col].piece) {
            break; // Stop if a piece blocks the path
          }
          moves.push([i, col]);
        }
      }
    }
  
    // If the rook is pinned along lines but not strictly row or column, no valid moves.
    return moves;
  }
  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0]
  ];
  for (const [dx, dy] of directions) {
    let newRow = row + dx, newCol = col + dy;
    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol].piece) {
        moves.push([newRow, newCol]);
      } else {
        if (board[newRow][newCol].piece[0] !== board[row][col].piece[0]) {
          moves.push([newRow, newCol]);
        }
        break;
      }
      newRow += dx;
      newCol += dy;
    }
  }
  return moves;
};

export const canRookAttack = (fromRow, fromCol, toRow, toCol, board) => {
  if (fromRow === toRow) {
    const step = fromCol < toCol ? 1 : -1;
    for (let col = fromCol + step; col !== toCol; col += step) {
      if (board[fromRow][col] && board[fromRow][col].piece) return false;
    }
    return true;
  }
  if (fromCol === toCol) {
    const step = fromRow < toRow ? 1 : -1;
    for (let row = fromRow + step; row !== toRow; row += step) {
      if (board[row][fromCol] && board[row][fromCol].piece) return false;
    }
    return true;
  }
  return false;
};