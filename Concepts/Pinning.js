import { kingsPosition } from "@/Pieces/King/King";

function gcd(a, b) {if (b === 0) { return a; } return gcd(b, a % b);}

export const isThePiecePinnedFromDiagonal = (board, row, col, currentPlayer) => {
    const kingSquare = kingsPosition(board, currentPlayer);
    
    // Check if the target piece is on a diagonal with the king
    const isOnDiagonal = Math.abs(row - kingSquare.row) === Math.abs(col - kingSquare.col);
    
    if (!isOnDiagonal) {
      return false; // If not on the same diagonal, it cannot be pinned by a bishop
    }
    
    // Find the diagonal basis

    const xofdia = row - kingSquare.row;
    const yofdia = col - kingSquare.col;
  
    const g =  gcd(Math.abs(xofdia), Math.abs(yofdia));

    const [dx, dy] = [xofdia / g, yofdia / g];

    // Check if something is in between
    let x = row, y = col;

    while (x !== kingSquare.row && y !== kingSquare.col) {
      x -= dx;
      y -= dy;

      if (board[x][y].piece && board[x][y].piece[1] !== 'k' && board[x][y].piece[0] !== currentPlayer) {
        return false;
      }
    }

    // Check if there is a queen or a bishop to pin the piece
    x = row, y = col;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      x += dx;
      y += dy;
      
      if (board[x][y] && board[x][y].piece) {
        if (board[x][y].piece[0] === currentPlayer) {
          return false;
        } else if (board[x][y].piece[1] === 'b' || board[x][y].piece[1] === 'q') {
          return true;
        } else {
          return false;
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

  // Define the directions for vertical and horizontal lines
  const directions = [
    { row: 0, col: 1 }, // Right (same row, increment column)
    { row: 0, col: -1 }, // Left (same row, decrement column)
    { row: 1, col: 0 }, // Down (increment row, same column)
    { row: -1, col: 0 } // Up (decrement row, same column)
  ];

  // Iterate through each direction (row/col)
  for (const direction of directions) {
    let currentRow = row + direction.row;
    let currentCol = col + direction.col;

    while (currentRow >= 0 && currentRow < 8 && currentCol >= 0 && currentCol < 8) {
      const currentSquare = board[currentRow][currentCol];
      
      // Check if the square contains a piece
      if (currentSquare.piece) {
        if (currentSquare.piece[0] !== currentPlayer) {
          // If there is an enemy piece on the line, check if it blocks the king
          if (currentSquare.piece[1] === 'r' || currentSquare.piece[1] === 'q') {
            // If a rook or queen is in line with the king, check if it's blocking the line
            if (currentRow === kingSquare.row || currentCol === kingSquare.col) {
              // This piece is pinning the piece at (row, col)
              return true;
            }
          }
        }
        break; // Stop if we encounter a piece (rook or something else), as it could block the pinning line
      }
      
      currentRow += direction.row;
      currentCol += direction.col;
    }
  }

  return false; // If no rook or queen is found blocking the line between the piece and the king
};