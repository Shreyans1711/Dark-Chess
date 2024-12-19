import Image from "next/image";
import bb from "./public/assets/bb.png";
import br from "./public/assets/br.png";
import bn from "./public/assets/bn.png";
import bq from "./public/assets/bq.png";
import bk from "./public/assets/bk.png";
import bp from "./public/assets/bp.png";
import wb from "./public/assets/wb.png";
import wr from "./public/assets/wr.png";
import wn from "./public/assets/wn.png";
import wq from "./public/assets/wq.png";
import wk from "./public/assets/wk.png";
import wp from "./public/assets/wp.png";

export const showPiece = (row, col) => {
    let piece = -1, alternate = -1;
    if (row === 0) {
        if (col === 0 || col === 7) {
            piece = br;
            alternate = "blackRook";
        }
        if (col === 1 || col === 6) {
            piece = bn;
            alternate = "blackKnight";
        }
        if (col === 2 || col === 5) {
            piece = bb;
            alternate = "blackBishop";
        }
        if (col === 3) {
            piece = bq;
            alternate = "blackQueen";
        }
        if (col === 4) {
            piece = bk;
            alternate = "blackKing";
        }
    }
    if (row === 7) {
        if (col === 0 || col === 7) {
            piece = wr;
            alternate = "whiteRook";
        }
        if (col === 1 || col === 6) {
            piece = wn;
            alternate = "whiteKnight";
        }
        if (col === 2 || col === 5) {
            piece = wb;
            alternate = "whiteBishop";
        }
        if (col === 3) {
            piece = wq;
            alternate = "whiteQueen"
        }
        if (col === 4) {
            piece = wk;
            alternate = "whiteKing";
        }
    }
    if (row === 1) {
        piece = bp;
        alternate = "blackPawn";
    }
    if (row === 6) {
        piece = wp;
        alternate = "whitePawn";
    }
    if (piece === -1) {
        return;
    }
    return (
      <Image src={piece} fill = {true} alt={alternate} />
    )
}

export const createBoard = () => {
    const board = [];
    for (let row = 0; row < 8; row++) {
    const currentRow = [];
    for (let col = 0; col < 8; col++) {
        let rank = row + 1;
        let file = String.fromCharCode(97 + col);
        currentRow.push(
            <div key={8 * row + col} className={`chess-square ${   (col + row) % 2 === 1 ? "bg-[#739552]" : "bg-[#ebecd0]" } w-[5rem] h-[5rem] flex justify-center items-end relative`}>
            {row === 7 && 
            <div className={`mb-1 absolute bottom-0 right-2 ${(col + row) % 2 === 0 ? "text-[#739552]" : "text-[#ebecd0]"}`}>
                {file}
            </div>
            }
            {col === 0 && 
            <div className={`mb-1 absolute top-1 left-1 ${  (col + row) % 2 === 0 ? "text-[#739552]" : "text-[#ebecd0]"}`}>
                {rank}
            </div>
            }
            {showPiece(row, col)}
        </div>
        );
    }
    board.push(
        <div key={row} className="flex">
        {currentRow}
        </div>
    );
    }
    return board;
};