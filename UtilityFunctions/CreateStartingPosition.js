import React from 'react'
const CreateStartingPosition = (board) => {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            board[row][col] = <div key={8 * row + col} className='chess-square bg-red-400 w-10 h-10'>
                                {/* Add any necessary content or components here */}
                                Hi
                               </div>
        }
    }
    console.log(board);
}

export default CreateStartingPosition
