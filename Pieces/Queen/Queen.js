import { isThePiecePinnedFromDiagonal, isThePiecePinnedFromLines } from "../../Concepts/Pinning"
import { getRookMoves, canRookAttack } from "../Rook/Rook";
import { getBishopMoves, canBishopAttack } from "../Bishop/Bishop";

// Check Queen moves

export const getQueenMoves = (row, col, board, currentPlayer) => {
    const moves = [];
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
    if (isThePiecePinnedFromDiagonal(board, row, col, currentPlayer)) {
        const kingSquare = kingsPosition(board, currentPlayer);

        const a = row - kingSquare.row;
        const b = col - kingSquare.col;
        const directions = [
            [1, 1], [1, -1], [-1, 1], [-1, -1]
        ];
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
    return [...getRookMoves(row, col, board, currentPlayer), ...getBishopMoves(row, col, board, currentPlayer)];
};

// check if Queen can attack from to to

export const canQueenAttack = (fromRow, fromCol, toRow, toCol, board) => {
    return (
        canRookAttack(fromRow, fromCol, toRow, toCol, board) ||
        canBishopAttack(fromRow, fromCol, toRow, toCol, board)
    );
};