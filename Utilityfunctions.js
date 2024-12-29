// Show the piece on the board
export const showPiece = (row, col) => {
  let piece = null;
  if (row === 0 || row === 7) {
    const isWhite = row === 7;
    const pieces = isWhite
      ? ["wr1", "wn1", "wb1", "wq", "wk", "wb2", "wn2", "wr2"]
      : ["br1", "bn1", "bb1", "bq", "bk", "bb2", "bn2", "br2"];
    piece = pieces[col];
  }
  if (row === 1 || row === 6) {
    const isWhite = row === 6;
    const pieces = isWhite
      ? ['wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8']
      : ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'];
    piece = pieces[col];
  }
  return piece;
};

// Create the initial board data
export const createBoardData = () => {
  const board = [];
  for (let row = 0; row < 8; row++) {
    const currentRow = [];
    for (let col = 0; col < 8; col++) {
      currentRow.push({
        piece: showPiece(row, col),
        file: String.fromCharCode(97 + col),
        rank: 8 - row,
      });
    }
    board.push(currentRow);
  }
  return board;
};

// Rooks
export const getRookMoves = (row, col, board, checkflag = {}) => {
  const moves = [];
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
          if (board[newRow][newCol]?.piece && board[newRow][newCol].piece[1] === 'k' && checkflag) {
            checkflag.current = true;
          }
        }
        break;
      }
      newRow += dx;
      newCol += dy;
    }
  }
  return moves;
};

// Knights
export const getKnightMoves = (row, col, board, checkflag) => {
  const moves = [];
  const directions = [
    [1, 2], [2, 1], [-1, 2], [-2, 1],
    [1, -2], [2, -1], [-1, -2], [-2, -1]
  ];
  for (const [dx, dy] of directions) {
    let newRow = row + dx, newCol = col + dy;
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol].piece || board[newRow][newCol].piece[0] !== board[row][col].piece[0]) {
        moves.push([newRow, newCol]);
        if (board[newRow][newCol]?.piece && board[newRow][newCol].piece[1] === 'k' && checkflag) {
          checkflag.current = true;
        }
      }
    }
  }
  return moves;
};

// Bishops
export const getBishopMoves = (row, col, board, checkflag = {}) => {
  const moves = [];
  const directions = [
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  for (const [dx, dy] of directions) {
    let newRow = row + dx, newCol = col + dy;
    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol].piece) {
        moves.push([newRow, newCol]);
      } else {
        if (board[newRow][newCol].piece[0] !== board[row][col].piece[0]) {
          moves.push([newRow, newCol]);
          if (board[newRow][newCol]?.piece && board[newRow][newCol].piece[1] === 'k' && checkflag) {
            checkflag.current = true;
          }
        }
        break;
      }
      newRow += dx;
      newCol += dy;
    }
  }
  return moves;
};

// Queen
export const getQueenMoves = (row, col, board, checkflag = {}) => {
  return [...getRookMoves(row, col, board, checkflag), ...getBishopMoves(row, col, board, checkflag)];
};

// King
export const getKingMoves = (row, col, board, currentPlayer) => {
  const moves = [];
  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  for (const [dx, dy] of directions) {
    let newRow = row + dx, newCol = col + dy;
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol].piece || board[newRow][newCol].piece[0] !== board[row][col].piece[0]) {
        if (isTheSquareSafe(newRow, newCol, board, currentPlayer).length === 0) {
          moves.push([newRow, newCol]);
        }
      }
    }
  }
  return moves;
};

// Pawn
export const getPawnMoves = (row, col, board, lastMove, checkflag) => {
  const moves = [];
  const alternate = board[row][col].piece[0]; // 'w' for white, 'b' for black
  const direction = alternate === 'w' ? -1 : 1;
  const startRow = alternate === 'w' ? 6 : 1;
  const newRow = row + direction;

  // Normal forward moves
  if (!board[newRow][col].piece) {
    moves.push([newRow, col]);
    // First double-move for pawns
    if (row === startRow && !board[newRow + direction][col].piece) {
      moves.push([newRow + direction, col]);
    }
  }

  // Capturing moves
  for (let dx of [-1, 1]) {
    const captureCol = col + dx;
    if (
      captureCol >= 0 &&
      captureCol < 8 &&
      board[newRow][captureCol]?.piece &&
      board[newRow][captureCol].piece[0] !== alternate
    ) {
      moves.push([newRow, captureCol]);
      if (board[newRow][captureCol]?.piece && board[newRow][captureCol].piece[1] === 'k' && checkflag) {
        checkflag.current = true;
      }
    }
  }

  // En-passant capturing moves
  for (let dx of [-1, 1]) {
    const captureCol = col + dx;
    if (
      captureCol >= 0 &&
      captureCol < 8 &&
      board[row][captureCol]?.piece &&
      board[row][captureCol].piece[0] !== alternate &&
      board[row][captureCol].piece[1] === 'p' &&
      lastMove &&
      lastMove.finalRow === row &&
      lastMove.finalCol === captureCol &&
      lastMove.initialRow === (startRow === 1 ? 6 : 1)
    ) {
      moves.push([newRow, captureCol]);
      console.log("En passant move detected!");
    }
  }

  return moves;
};


export const getAllMoves = (board, currentPlayer, lastMove) => {
  const moves = {};
  let squaresAttackedByTheCheckingPiece = [];
  const kingSquare = kingsPosition(board, currentPlayer);
  console.log(kingSquare)
  let piecesAttackingKing = isTheSquareSafe(kingSquare.row, kingSquare.col, board, currentPlayer);
  console.log(piecesAttackingKing)
  if (piecesAttackingKing.length !== 0) {
    moves[`${board[kingSquare.row][kingSquare.col].piece}_${kingSquare.row}_${kingSquare.col}`] = getKingMoves(kingSquare.row, kingSquare.col, board, currentPlayer);
    if (piecesAttackingKing.length === 1) {
      switch (piecesAttackingKing[0].piece[1]) {
        case 'r': // Rook
          if (piecesAttackingKing[0].row === kingSquare.row) {
            if (piecesAttackingKing[0].col < kingSquare.col) {
              for (let i = piecesAttackingKing[0].col + 1; i < kingSquare.col; i++) {
                squaresAttackedByTheCheckingPiece.push([kingSquare.row, i]);
              }
            } else {
              for (let i = piecesAttackingKing[0].col - 1; i > kingSquare.col; i--) {
                squaresAttackedByTheCheckingPiece.push([kingSquare.row, i]);
              }
            }
          } else if (piecesAttackingKing[0].col === kingSquare.col) {
            if (piecesAttackingKing[0].row < kingSquare.row) {
              for (let i = piecesAttackingKing[0].row + 1; i < kingSquare.row; i++) {
                squaresAttackedByTheCheckingPiece.push([i, kingSquare.col]);
              }
            } else {
              for (let i = piecesAttackingKing[0].row - 1; i > kingSquare.row; i--) {
                squaresAttackedByTheCheckingPiece.push([i, kingSquare.col]);
              }
            }
          }
          squaresAttackedByTheCheckingPiece.push([piecesAttackingKing[0].row, piecesAttackingKing[0].col]); // Include attacking rook's square
          break;

        case 'n': // Knight
          squaresAttackedByTheCheckingPiece.push([piecesAttackingKing[0].row, piecesAttackingKing[0].col]);
          break;

        case 'b': // Bishop
          if (Math.abs(piecesAttackingKing[0].row - kingSquare.row) === Math.abs(piecesAttackingKing[0].col - kingSquare.col)) {
            let rowDirection = piecesAttackingKing[0].row < kingSquare.row ? 1 : -1;
            let colDirection = piecesAttackingKing[0].col < kingSquare.col ? 1 : -1;

            let i = piecesAttackingKing[0].row + rowDirection;
            let j = piecesAttackingKing[0].col + colDirection;

            while (i !== kingSquare.row && j !== kingSquare.col) {
              squaresAttackedByTheCheckingPiece.push([i, j]);
              i += rowDirection;
              j += colDirection;
            }
          }
          squaresAttackedByTheCheckingPiece.push([piecesAttackingKing[0].row, piecesAttackingKing[0].col]); // Include attacking bishop's square
          break;

        case 'q': // Queen
          if (piecesAttackingKing[0].row === kingSquare.row || piecesAttackingKing[0].col === kingSquare.col) {
            // Horizontal or Vertical (Rook-like behavior)
            if (piecesAttackingKing[0].row === kingSquare.row) {
              if (piecesAttackingKing[0].col < kingSquare.col) {
                for (let i = piecesAttackingKing[0].col + 1; i < kingSquare.col; i++) {
                  squaresAttackedByTheCheckingPiece.push([kingSquare.row, i]);
                }
              } else {
                for (let i = piecesAttackingKing[0].col - 1; i > kingSquare.col; i--) {
                  squaresAttackedByTheCheckingPiece.push([kingSquare.row, i]);
                }
              }
            } else {
              if (piecesAttackingKing[0].row < kingSquare.row) {
                for (let i = piecesAttackingKing[0].row + 1; i < kingSquare.row; i++) {
                  squaresAttackedByTheCheckingPiece.push([i, kingSquare.col]);
                }
              } else {
                for (let i = piecesAttackingKing[0].row - 1; i > kingSquare.row; i--) {
                  squaresAttackedByTheCheckingPiece.push([i, kingSquare.col]);
                }
              }
            }
          } else if (Math.abs(piecesAttackingKing[0].row - kingSquare.row) === Math.abs(piecesAttackingKing[0].col - kingSquare.col)) {
            // Diagonal (Bishop-like behavior)
            let rowDirection = piecesAttackingKing[0].row < kingSquare.row ? 1 : -1;
            let colDirection = piecesAttackingKing[0].col < kingSquare.col ? 1 : -1;

            let i = piecesAttackingKing[0].row + rowDirection;
            let j = piecesAttackingKing[0].col + colDirection;

            while (i !== kingSquare.row && j !== kingSquare.col) {
              squaresAttackedByTheCheckingPiece.push([i, j]);
              i += rowDirection;
              j += colDirection;
            }
          }
          squaresAttackedByTheCheckingPiece.push([piecesAttackingKing[0].row, piecesAttackingKing[0].col]); // Include attacking queen's square
          break;

        case 'p': // Pawn
          squaresAttackedByTheCheckingPiece.push([piecesAttackingKing[0].row, piecesAttackingKing[0].col]);
          break;

        default:
          break;
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (board[i][j].piece && board[i][j].piece[0] === currentPlayer) {
          const piece = board[i][j].piece;
          for (let k = 0; k < squaresAttackedByTheCheckingPiece.length; k++) {
            let possibleMoves = [];
            switch (board[i][j].piece[1]) {
              case 'r': // Rook
                const possibleMovesByTheRook = getRookMoves(i, j, board);
                for (let l = 0; l < possibleMovesByTheRook.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByTheRook[l][0] && square[1] === possibleMovesByTheRook[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByTheRook[l]);
                  }
                }
                break;

              case 'n': // Knight
                const possibleMovesByTheKnight = getKnightMoves(i, j, board);
                for (let l = 0; l < possibleMovesByTheKnight.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByTheKnight[l][0] && square[1] === possibleMovesByTheKnight[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByTheKnight[l]);
                  }
                }
                break;

              case 'b': // Bishop
                const possibleMovesByTheBishop = getBishopMoves(i, j, board);
                for (let l = 0; l < possibleMovesByTheBishop.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByTheBishop[l][0] && square[1] === possibleMovesByTheBishop[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByTheBishop[l]);
                  }
                }
                break;

              case 'q': // Queen
                const possibleMovesByTheQueen = getQueenMoves(i, j, board);
                for (let l = 0; l < possibleMovesByTheQueen.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByTheQueen[l][0] && square[1] === possibleMovesByTheQueen[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByTheQueen[l]);
                  }
                }
                break;

              case 'p': // Pawn
                const possibleMovesByThePawn = getPawnMoves(i, j, board);
                for (let l = 0; l < possibleMovesByThePawn.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByThePawn[l][0] && square[1] === possibleMovesByThePawn[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByThePawn[l]);
                  }
                }
                break;

              default:
                break;
            }
            if (possibleMoves.length > 0) {
              moves[`${piece}_${i}_${j}`] = possibleMoves;
            }
          }
        }
      }
    }
    return moves;
  }


  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col].piece;
      if (!piece || piece[0] !== currentPlayer) continue;

      let possibleMoves = [];
      switch (piece) {
        // Rooks
        case 'wr1': case 'wr2': case 'br1': case 'br2':
          possibleMoves = getRookMoves(row, col, board);
          break;

        // Knights
        case 'wn1': case 'wn2': case 'bn1': case 'bn2':
          possibleMoves = getKnightMoves(row, col, board);
          break;

        // Bishops
        case 'wb1': case 'wb2': case 'bb1': case 'bb2':
          possibleMoves = getBishopMoves(row, col, board);
          break;

        // Queens
        case 'wq': case 'bq':
          possibleMoves = getQueenMoves(row, col, board);
          break;

        // Kings
        case 'wk': case 'bk':
          possibleMoves = getKingMoves(row, col, board, currentPlayer);
          break;

        // Pawns
        case 'wp1': case 'wp2': case 'wp3': case 'wp4':
        case 'wp5': case 'wp6': case 'wp7': case 'wp8':
        case 'bp1': case 'bp2': case 'bp3': case 'bp4':
        case 'bp5': case 'bp6': case 'bp7': case 'bp8':
          possibleMoves = getPawnMoves(row, col, board, lastMove);
          break;
      }

      if (possibleMoves.length > 0) {
        moves[`${piece}_${row}_${col}`] = possibleMoves;
      }
    }
  }
  return moves;
};

export const isTheSquareSafe = (row, col, board, currentPlayer) => {
  // Iterate through the board to check if any opponent piece can attack (row, col)
  let pieces = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const pie = board[i][j].piece;
      // Check if there's an opponent's piece
      if (pie && pie[0] !== currentPlayer) {
        if (canPieceAttackSquare(pie, i, j, row, col, board)) {
          pieces.push({ piece: pie, row: i, col: j }); // The square is not safe
        }
      }
    }
  }
  return pieces; // No opponent piece can attack this square
};

// Helper function to determine if a piece can attack a specific square
const canPieceAttackSquare = (piece, fromRow, fromCol, toRow, toCol, board) => {
  switch (piece[1]) {
    case 'p':
      return canPawnAttack(fromRow, fromCol, toRow, toCol, piece[0]);
    case 'r':
      return canRookAttack(fromRow, fromCol, toRow, toCol, board);
    case 'n':
      return canKnightAttack(fromRow, fromCol, toRow, toCol);
    case 'b':
      return canBishopAttack(fromRow, fromCol, toRow, toCol, board);
    case 'q':
      return canQueenAttack(fromRow, fromCol, toRow, toCol, board);
    case 'k':
      return canKingAttack(fromRow, fromCol, toRow, toCol);
    default:
      return false;
  }
};

// Pawn attack logic
const canPawnAttack = (fromRow, fromCol, toRow, toCol, color) => {
  const direction = color === 'w' ? -1 : 1;
  return (
    (toRow === fromRow + direction) &&
    (toCol === fromCol + 1 || toCol === fromCol - 1)
  );
};

// Rook attack logic
const canRookAttack = (fromRow, fromCol, toRow, toCol, board) => {
  if (fromRow === toRow) {
    const step = fromCol < toCol ? 1 : -1;
    for (let col = fromCol + step; col !== toCol; col += step) {
      if (board[fromRow][col].piece) return false;
    }
    return true;
  }
  if (fromCol === toCol) {
    const step = fromRow < toRow ? 1 : -1;
    for (let row = fromRow + step; row !== toRow; row += step) {
      if (board[row][fromCol].piece) return false;
    }
    return true;
  }
  return false;
};

// Knight attack logic
const canKnightAttack = (fromRow, fromCol, toRow, toCol) => {
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};

// Bishop attack logic
const canBishopAttack = (fromRow, fromCol, toRow, toCol, board) => {
  if (Math.abs(fromRow - toRow) === Math.abs(fromCol - toCol)) {
    const rowStep = fromRow < toRow ? 1 : -1;
    const colStep = fromCol < toCol ? 1 : -1;
    let row = fromRow + rowStep;
    let col = fromCol + colStep;

    while (row !== toRow && col !== toCol) {
      if (board[row][col].piece) return false;
      row += rowStep;
      col += colStep;
    }
    return true;
  }
  return false;
};

// Queen attack logic (combines rook and bishop logic)
const canQueenAttack = (fromRow, fromCol, toRow, toCol, board) => {
  return (
    canRookAttack(fromRow, fromCol, toRow, toCol, board) ||
    canBishopAttack(fromRow, fromCol, toRow, toCol, board)
  );
};

// King attack logic
const canKingAttack = (fromRow, fromCol, toRow, toCol) => {
  const rowDiff = Math.abs(fromRow - toRow);
  const colDiff = Math.abs(fromCol - toCol);
  return rowDiff <= 1 && colDiff <= 1;
};

const kingsPosition = (board, currentPlayer) => {
  let kingSquare = { row: null, col: null };
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (board[row][col].piece && board[row][col].piece[0] === currentPlayer && board[row][col].piece[1] === 'k') {
        kingSquare.row = row;
        kingSquare.col = col;
        break;
      }
    }
    if (kingSquare.row) break;
  }
  return kingSquare;
}