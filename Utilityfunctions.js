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

// Show the piece on the board
export const showPiece = (row, col) => {
  let piece = null, alternate = "";
  if (row === 0 || row === 7) {
    const isWhite = row === 7;
    const pieces = isWhite
      ? [wr, wn, wb, wq, wk, wb, wn, wr]
      : [br, bn, bb, bq, bk, bb, bn, br];
    piece = pieces[col];
    alternate = isWhite ? "white" : "black";
  }
  if (row === 1 || row === 6) {
    piece = row === 1 ? bp : wp;
    alternate = row === 1 ? "blackPawn" : "whitePawn";
  }
  return piece ? (
    <Image src={piece} fill={true} alt={alternate} className="cursor-pointer" />
  ) : null;
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
        rank: row + 1,
      });
    }
    board.push(currentRow);
  }
  return board;
};