import { isTheSquareSafe, hasAPieceMoved } from "@/Utilityfunctions";
// function to find all possible moves of king
export const getKingMoves = (row, col, board, currentPlayer, AllMovesTillNow) => {
    const moves = [];
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    // Handle castling
    const castle = canKingCastle(board, currentPlayer, AllMovesTillNow);
    if (castle.shortCastle) {
        moves.push([row, 6]); // Short castle
    }
    if (castle.longCastle) {
        moves.push([row, 2]); // Long castle
    }

    // Loop through all possible king moves
    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;

        // Ensure move is within bounds
        if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetCell = board[newRow][newCol];

            // Check if the target cell is empty or has an opponent's piece
            if (!targetCell.piece || targetCell.piece[0] !== board[row][col].piece[0]) {
                // Simulate the move
                const newBoard = simulateMove(board, row, col, newRow, newCol);

                // Check if the king would still be in check after the move
                if (isTheSquareSafe(newRow, newCol, newBoard, currentPlayer).length === 0) {
                    moves.push([newRow, newCol]);
                }
            }
        }
    }

    return moves;
};

// Helper function to simulate a move
const simulateMove = (board, startRow, startCol, endRow, endCol) => {
    // Create a deep copy of the board to simulate the move
    const newBoard = board.map(row => row.map(cell => ({ ...cell })));

    // Move the piece to the target square
    newBoard[endRow][endCol].piece = newBoard[startRow][startCol].piece;

    // Empty the original square
    newBoard[startRow][startCol].piece = null;

    return newBoard;
};
// function to check if a piece on fromRow, fromCol can attack a piece on toRow, toCol
export const canKingAttack = (fromRow, fromCol, toRow, toCol) => {
    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);
    return rowDiff <= 1 && colDiff <= 1;
};
// function to find position of king
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
    
    if (!Array.isArray(AllMovesTillNow) || AllMovesTillNow.some((move) => move.piece === (currentPlayer + 'k'))) return { shortCastle: false, longCastle: false };

    // Short Castle (King-Side)


    let shortCastle = true;
    if (AllMovesTillNow.some((move) => {(move.piece === currentPlayer + 'r') && (move.initialRow === kingRow) && (move.initialCOl === 7)})) shortCastle = false;
    if (
        board[kingRow][5].piece || 
        board[kingRow][6].piece || 
        (isTheSquareSafe(kingRow, kingCol, board, currentPlayer).length !== 0) ||
        (isTheSquareSafe(kingRow, 5, board, currentPlayer).length !== 0) ||
        (isTheSquareSafe(kingRow, 6, board, currentPlayer).length !== 0)
    ) {
        shortCastle = false;
    }

    // Long Castle (Queen-Side)
    let longCastle = true;
    if (AllMovesTillNow.some((move) => {(move.piece === currentPlayer + 'r') && (move.initialRow === kingRow) && (move.initialCOl === 0)})) longCastle = false;
    if (
        board[kingRow][1].piece || 
        board[kingRow][2].piece || 
        board[kingRow][3].piece || 
        (isTheSquareSafe(kingRow, kingCol,board, currentPlayer).length !== 0) ||
        (isTheSquareSafe(kingRow, 2,board, currentPlayer).length !== 0) ||
        (isTheSquareSafe(kingRow, 3,board, currentPlayer).length !== 0)
    ) {
        longCastle = false;
    }

    return { shortCastle, longCastle };
};

