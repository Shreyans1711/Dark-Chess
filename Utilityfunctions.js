// Show the piece on the board
export const showPiece = (row, col) => {
  let piece = null, alternate = "";
  if (row === 0 || row === 7) {
    const isWhite = row === 7;
    const pieces = isWhite
      ? ["wr1", "wn1", "wb1", "wq", "wk", "wb2", "wn2", "wr2"]
      : ["br1", "bn1", "bb1", "bq", "bk", "bb2", "bn2", "br2"];
    piece = pieces[col];
    alternate = isWhite ? "white" : "black";
  }
  if (row === 1 || row === 6) {
    const isWhite = row === 6;
    const pieces = isWhite  
      ? ['wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8']
      : ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'];
    piece = pieces[col];
    alternate = isWhite ? "white" : "black";
  }
  return { piece, alternate };
};

// Create the initial board data
export const createBoardData = () => {
  const board = [];
  for (let row = 0; row < 8; row++) {
    const currentRow = [];
    for (let col = 0; col < 8; col++) {
      currentRow.push({
        piece: showPiece(row, col).piece,
        alternate: showPiece(row, col).alternate,
        file: String.fromCharCode(97 + col),
        rank: 8 - row,
      });
    }
    board.push(currentRow);
  }
  return board;
};

// Rooks
export const getRookMoves = (row, col, board) => {
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
        if (board[newRow][newCol].alternate !== board[row][col].alternate) {
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

// Knights
export const getKnightMoves = (row, col, board) => {
  const moves = [];
  const directions = [
    [1, 2], [2, 1], [-1, 2], [-2, 1],
    [1, -2], [2, -1], [-1, -2], [-2, -1]
  ];
  for (const [dx, dy] of directions) {
    let newRow = row + dx, newCol = col + dy;
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      if (!board[newRow][newCol].piece || board[newRow][newCol].alternate !== board[row][col].alternate) {
        moves.push([newRow, newCol]);
      }
    }
  }
  return moves;
};

// Bishops
export const getBishopMoves = (row, col, board) => {
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
        if (board[newRow][newCol].alternate !== board[row][col].alternate) {
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

// Queen
export const getQueenMoves = (row, col, board) => {
  return [...getRookMoves(row, col, board), ...getBishopMoves(row, col, board)];
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
      if (!board[newRow][newCol].piece || board[newRow][newCol].alternate !== board[row][col].alternate) {
        moves.push([newRow, newCol]);
      }
    }
  }
  return moves;
};

// Pawn
export const getPawnMoves = (row, col, board) => {
  const moves = [];
  const alternate = board[row][col].alternate;
  const direction = alternate === 'white' ? -1 : 1;
  const startRow = alternate === 'white' ? 6 : 1;
  const newRow = row + direction;

  if (!board[newRow][col].piece) {
    moves.push([newRow, col]);
    if (row === startRow && !board[newRow + direction][col].piece) {
      moves.push([newRow + direction, col]);
    }
  }

  for (let dx of [-1, 1]) {
    let captureCol = col + dx;
    if (captureCol >= 0 && captureCol < 8 && board[newRow][captureCol]?.piece && board[newRow][captureCol].alternate !== alternate) {
      moves.push([newRow, captureCol]);
    }
  }

  return moves;
};
export const getAllMoves = (board, currentPlayer) => {
  const moves = {};

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const { piece, alternate } = board[row][col];
      if (!piece || alternate !== currentPlayer) continue;

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
          possibleMoves = getPawnMoves(row, col, board);
          break;
      }

      if (possibleMoves.length > 0) {
        moves[`${piece}_${row}_${col}`] = possibleMoves;
      }
    }
  }

  return moves;
};
