"use client";
import React, { useState } from "react";
import { createBoard } from "../Utilityfunctions";

export default function Home() {
  const [chessBoard, setChessBoard] = useState(createBoard());
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div>{chessBoard}</div>
    </div>
  );
}
