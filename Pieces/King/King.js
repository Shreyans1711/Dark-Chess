import { isTheSquareSafe } from "@/Utilityfunctions";

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

// King attack logic
export const canKingAttack = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return rowDiff <= 1 && colDiff <= 1;
};

export const kingsPosition = (board, currentPlayer) => {
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