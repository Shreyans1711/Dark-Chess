import { isThePiecePinnedFromDiagonal, isThePiecePinnedFromLines } from "../../Concepts/Pinning"

export const getKnightMoves = (row, col, board, currentPlayer) => {
    const moves = [];
    if (isThePiecePinnedFromDiagonal(board, row, col, currentPlayer) || isThePiecePinnedFromLines(board, row, col, currentPlayer)) {
        return moves;
    }
    const directions = [
        [1, 2], [2, 1], [-1, 2], [-2, 1],
        [1, -2], [2, -1], [-1, -2], [-2, -1]
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

export const canKnightAttack = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
};