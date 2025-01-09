import {isThePiecePinnedFromDiagonal, isThePiecePinnedFromLines} from "../../Concepts/Pinning"

export const getBishopMoves = (row, col, board, currentPlayer) => {
  const moves = [];
  // if bishop is pinned from a rook or queen horizontally or vertically
  if (isThePiecePinnedFromLines(board, row, col, currentPlayer)) {
    return moves;
  } 
  const directions = [
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  // if bishop is pinned in diagonal then it will be able to move on the same diagonal
  if (isThePiecePinnedFromDiagonal(board, row, col, currentPlayer)) {
    const kingSquare = kingsPosition(board, currentPlayer);

    const a = row - kingSquare.row;
    const b = col - kingSquare.col;
    for (const [dx, dy] of directions) {
      // Check if the current direction aligns with the pin direction
      if (dx * b !== dy * a) {
        continue;
      }
      
      let newRow = row + dx;
      let newCol = col + dy;
      
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
  }
  // return the moves when it is not pinned
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

export const canBishopAttack = (fromRow, fromCol, toRow, toCol, board) => {
    if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
      const rowStep = fromRow < toRow ? 1 : -1;
      const colStep = fromCol < toCol ? 1 : -1;
      let row = fromRow + rowStep;
      let col = fromCol + colStep;
  
      while (row !== toRow || col !== toCol) {
        // Ensure we are within bounds
        if (row < 0 || row >= 8 || col < 0 || col >= 8) {
          return false; // Out of bounds, invalid move
        }
  
        // Check if there's a blocking piece
        if (board[row][col] && board[row][col].piece) {
          return false; // Path is blocked
        }
  
        row += rowStep;
        col += colStep;
      }
  
      return true; // No blocking pieces, valid bishop attack path
    }
    return false; // Not a diagonal move
  };
  