import { kingsPosition } from "@/Pieces/King/King";

function gcd(a, b) {if (b === 0) { return a; } return gcd(b, a % b);}

export const isThePiecePinnedFromDiagonal = (board, row, col, currentPlayer) => {
  const kingSquare = kingsPosition(board, currentPlayer);
  // Check if the target piece is on a diagonal with the king
  const isOnDiagonal = Math.abs(row - kingSquare.row) === Math.abs(col - kingSquare.col);
  if (!isOnDiagonal) {
      return false; // Not on the same diagonal
  }
  
  // Find the diagonal direction
  const xofdia = row - kingSquare.row;
  const yofdia = col - kingSquare.col;
  const g = gcd(Math.abs(xofdia), Math.abs(yofdia));
  const [dx, dy] = [xofdia / g, yofdia / g];

  // Check if something is in between the piece and the king
  let x = row, y = col;
  while (x !== kingSquare.row && y !== kingSquare.col) {
      x -= dx;
      y -= dy;
      if (x < 0 || x >= 8 || y < 0 || y >= 8) break; // Prevent out-of-bounds access

      if (board[x][y]?.piece) {
          if (board[x][y].piece[1] !== 'k') {
              return false; // Another piece blocking the diagonal
          }
      }
  }

  // Check for a queen or bishop in the opposite direction
  x = row;
  y = col;
  while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      x += dx;
      y += dy;

      if (x < 0 || x >= 8 || y < 0 || y >= 8) break; // Prevent out-of-bounds access

      if (board[x][y]?.piece) {
          if (board[x][y].piece[0] === currentPlayer) {
              return false; // Friendly piece blocking
          } else if (board[x][y].piece[1] === 'b' || board[x][y].piece[1] === 'q') {
              return true; // Opponent's bishop or queen pins the piece
          } else {
              return false; // Another piece blocks the diagonal
          }
      }
  }

  return false;
};

export const isThePiecePinnedFromLines = (board, row, col, currentPlayer) => {
  const kingSquare = kingsPosition(board, currentPlayer);
  
  // Check if the target piece is in line with the king horizontally or vertically
  const isInSameRow = row === kingSquare.row;
  const isInSameCol = col === kingSquare.col;
  
  if (!isInSameRow && !isInSameCol) {
    return false; // If not in the same row or column, it cannot be pinned by a rook
  }
  if (isInSameRow) {
    let inc = (col > kingSquare.col ? -1 : 1);
    // Check if there is a piece in between the piece and the king
    for (let i = col + inc;i != kingSquare.col;i += (inc)) {
      if (board[row][i] && board[row][i].piece) {
        return false;
      }
    }

    // Check if there is a pinning piece directly towards the pinned piece;

    for (let i = col - inc;i < 8 && i >= 0;i -= inc) {
      if (board[row][i] && board[row][i].piece) {
        if (board[row][i].piece[0] !== currentPlayer && (board[row][i].piece[1] === 'r' || board[row][i].piece[1] === 'q')) {
          return true;
        } else return false;
      }
    }
    return false;
  }
  if (isInSameCol) {
    let inc = (row > kingSquare.row ? -1 : 1);
    // Check if there is a piece in between the piece and the king
    for (let i = row + inc;i != kingSquare.row;i += (inc)) {
      if (board[i][col] && board[i][col].piece) {
        return false;
      }
    }

    // Check if there is a pinning piece directly towards the pinned piece;

    for (let i = row - inc;i < 8 && i >= 0;i -= inc) {
      if (board[i][col] && board[i][col].piece) {
        if (board[i][col].piece[0] !== currentPlayer && (board[i][col].piece[1] === 'r' || board[i][col].piece[1] === 'q')) {
          return true;
        } else return false;
      }
    }
    return false;
  }
};