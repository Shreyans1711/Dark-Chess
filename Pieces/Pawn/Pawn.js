import { isThePiecePinnedFromDiagonal, isThePiecePinnedFromLines } from "@/Concepts/Pinning";

export const getPawnMoves = (row, col, board, lastMove, currentPlayer) => {
    const moves = [];

    // Check if the pawn is pinned along lines
    if (isThePiecePinnedFromLines(board, row, col, currentPlayer)) {
        return moves;
    }

    // Check if the pawn is pinned along diagonals
    const pinnedDirection = isThePiecePinnedFromDiagonal(board, row, col, currentPlayer);

    const alternate = board[row][col].piece[0]; // 'w' for white, 'b' for black
    const direction = alternate === 'w' ? -1 : 1;
    const startRow = alternate === 'w' ? 6 : 1;
    const newRow = row + direction;
    // Normal forward moves
    if (!pinnedDirection || pinnedDirection[0] === direction && pinnedDirection[1] === 0) {
        if (!board[newRow][col].piece) {
            moves.push([newRow, col]);
            // First double-move for pawns
            if (row === startRow && !board[newRow + direction][col].piece) {
                moves.push([newRow + direction, col]);
            }
        }
    }

    // Capturing moves
    for (let dx of [-1, 1]) {
        const captureCol = col + dx;
        if (
            (!pinnedDirection || (pinnedDirection[0] === direction && pinnedDirection[1] === dx)) &&
            captureCol >= 0 &&
            captureCol < 8 &&
            board[newRow][captureCol]?.piece &&
            board[newRow][captureCol].piece[0] !== alternate
        ) {
            moves.push([newRow, captureCol]);
        }
    }

    // En-passant capturing moves
    for (let dx of [-1, 1]) {
        const captureCol = col + dx;
        if (
            (!pinnedDirection || (pinnedDirection[0] === direction && pinnedDirection[1] === dx)) &&
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
        }
    }
    return moves;
};
// function to check if pawn can attack from to to
export const canPawnAttack = (fromRow, fromCol, toRow, toCol, color) => {
    const direction = color === 'w' ? -1 : 1;
    return (
        (toRow === fromRow + direction) &&
        (toCol === fromCol + 1 || toCol === fromCol - 1)
    );
};