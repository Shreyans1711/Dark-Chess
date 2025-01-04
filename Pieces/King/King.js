import { isTheSquareSafe, hasAPieceMoved } from "@/Utilityfunctions";

export const getKingMoves = (row, col, board, currentPlayer, AllMovesTillNow) => {
    const moves = [];
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];
    const castle = canKingCastle(board, currentPlayer, AllMovesTillNow);
    if (castle.shortCastle) {
        moves.push([row, 6]);
    }

    if (castle.longCastle) {
        moves.push([row, 2]);
    }
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

const canKingCastle = (board, currentPlayer, AllMovesTillNow) => {
    const kingRow = currentPlayer === 'w' ? 7 : 0; // White king on row 7, black king on row 0
    const kingCol = 4; // King's initial column
    
    // Check if the king has moved
    if (hasAPieceMoved(currentPlayer + 'k', AllMovesTillNow)) return { shortCastle: false, longCastle: false };

    // Short Castle (King-Side)
    let shortCastle = true;
    if (hasAPieceMoved(currentPlayer + 'r2', AllMovesTillNow)) shortCastle = false;
    if (
        board[kingRow][5].piece || 
        board[kingRow][6].piece || 
        !isTheSquareSafe(kingRow, kingCol, board, currentPlayer) ||
        !isTheSquareSafe(kingRow, 5, board, currentPlayer) ||
        !isTheSquareSafe(kingRow, 6, board, currentPlayer)
    ) {
        shortCastle = false;
    }

    // Long Castle (Queen-Side)
    let longCastle = true;
    if (hasAPieceMoved(currentPlayer + 'r1', AllMovesTillNow)) longCastle = false;
    if (
        board[kingRow][1].piece || 
        board[kingRow][2].piece || 
        board[kingRow][3].piece || 
        !isTheSquareSafe(kingRow, kingCol,board, currentPlayer) ||
        !isTheSquareSafe(kingRow, 2,board, currentPlayer) ||
        !isTheSquareSafe(kingRow, 3,board, currentPlayer)
    ) {
        longCastle = false;
    }

    return { shortCastle, longCastle };
};

