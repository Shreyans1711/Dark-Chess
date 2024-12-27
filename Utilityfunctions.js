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
          if(board[newRow][newCol]?.piece && board[newRow][newCol].piece[1] === 'k' && checkflag) {
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
        if(board[newRow][newCol]?.piece && board[newRow][newCol].piece[1] === 'k' && checkflag) {
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
          if(board[newRow][newCol]?.piece && board[newRow][newCol].piece[1] === 'k' && checkflag) {
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
export const getQueenMoves = (row, col, board, checkflag = {} ) => {
  return [...getRookMoves(row, col, board, checkflag), ...getBishopMoves(row, col, board, checkflag)];
};

// King
export const getKingMoves = (row, col, board) => {
  const moves = [];
  const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [1, 1], [1, -1], [-1, 1], [-1, -1]
  ];
  for (const [dx, dy] of directions) {
    let newRow = row + dx, newCol = col + dy;
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol].piece || board[newRow][newCol].piece[0] !== board[row][col].piece[0]) {
        moves.push([newRow, newCol]);
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
      if(board[newRow][captureCol]?.piece && board[newRow][captureCol].piece[1] === 'k' && checkflag) {
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
          possibleMoves = getKingMoves(row, col, board);
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