import { getKingMoves, canKingAttack, kingsPosition } from "./Pieces/King/King";
import { getBishopMoves, canBishopAttack } from "./Pieces/Bishop/Bishop";
import { getRookMoves, canRookAttack } from "./Pieces/Rook/Rook";
import { getKnightMoves, canKnightAttack } from "./Pieces/Knight/Knight";
import { getQueenMoves, canQueenAttack } from "./Pieces/Queen/Queen";
import { getPawnMoves, canPawnAttack } from "./Pieces/Pawn/Pawn";

// Show the piece on the board
export const showPiece = (row, col) => {
  let piece = null;
  if (row === 0 || row === 7) {
    const isWhite = row === 7;
    const pieces = isWhite
      ? ['wr', 'wn', 'wb', 'wq','wk', 'wb', 'wn', 'wr']
      : ['br', 'bn', 'bb', 'bq','bk', 'bb', 'bn', 'br'];
    piece = pieces[col];
  }
  if (row === 1 || row === 6) {
    const isWhite = row === 6;
    const pieces = isWhite
    ? ['wp','wp','wp','wp','wp','wp','wp','wp']
    : ['bp','bp','bp','bp','bp','bp','bp','bp'];
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
        id : `${String.fromCharCode(97 + col)}_${8 - row}`,
      });
    }
    board.push(currentRow);
  }
  return board;
};

export const getAllMoves = (board, currentPlayer, lastMove, AllMovesTillNow) => {
  const moves = {};
  let squaresAttackedByTheCheckingPiece = [];
  const kingSquare = kingsPosition(board, currentPlayer);
  let piecesAttackingKing = isTheSquareSafe(kingSquare.row, kingSquare.col, board, currentPlayer);
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
                const possibleMovesByTheRook = getRookMoves(i, j, board,currentPlayer);
                for (let l = 0; l < possibleMovesByTheRook.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByTheRook[l][0] && square[1] === possibleMovesByTheRook[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByTheRook[l]);
                  }
                }
                break;

              case 'n': // Knight
                const possibleMovesByTheKnight = getKnightMoves(i, j, board, currentPlayer);
                for (let l = 0; l < possibleMovesByTheKnight.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByTheKnight[l][0] && square[1] === possibleMovesByTheKnight[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByTheKnight[l]);
                  }
                }
                break;

              case 'b': // Bishop
                const possibleMovesByTheBishop = getBishopMoves(i, j, board, currentPlayer);
                for (let l = 0; l < possibleMovesByTheBishop.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByTheBishop[l][0] && square[1] === possibleMovesByTheBishop[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByTheBishop[l]);
                  }
                }
                break;

              case 'q': // Queen
                const possibleMovesByTheQueen = getQueenMoves(i, j, board, currentPlayer);
                for (let l = 0; l < possibleMovesByTheQueen.length; l++) {
                  if (squaresAttackedByTheCheckingPiece.some(
                    (square) => square[0] === possibleMovesByTheQueen[l][0] && square[1] === possibleMovesByTheQueen[l][1]
                  )) {
                    possibleMoves.push(possibleMovesByTheQueen[l]);
                  }
                }
                break;

              case 'p': // Pawn
                const possibleMovesByThePawn = getPawnMoves(i, j, board,lastMove, currentPlayer);
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
        case 'wr': case 'br':
          possibleMoves = getRookMoves(row, col, board, currentPlayer);
          break;

        // Knights
        case 'wn': case 'bn':
          possibleMoves = getKnightMoves(row, col, board, currentPlayer);
          break;

        // Bishops
        case 'wb': case 'bb':
          possibleMoves = getBishopMoves(row, col, board, currentPlayer);
          break;

        // Queens
        case 'wq': case 'bq':
          possibleMoves = getQueenMoves(row, col, board, currentPlayer);
          break;

        // Kings
        case 'wk': case 'bk':
          possibleMoves = getKingMoves(row, col, board, currentPlayer, AllMovesTillNow);
          break;

        // Pawns
        case 'wp':case 'bp':
          possibleMoves = getPawnMoves(row, col, board, lastMove, currentPlayer);
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
  return pieces; // Opponent pieces that can attack this square
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
