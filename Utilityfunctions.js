// Show the piece on the board
export const showPiece = (row, col) => {
  let piece = null, alternate = "";
  if (row === 0 || row === 7) {
    const isWhite = row === 7;
    const pieces = isWhite
      ? ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
      : ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"];
    piece = pieces[col];
    alternate = isWhite ? "white" : "black";
  }
  if (row === 1 || row === 6) {
    piece = row === 1 ? "bp" : "wp";
    alternate = row === 1 ? "blackPawn" : "whitePawn";
  }
  return {piece, alternate};
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
