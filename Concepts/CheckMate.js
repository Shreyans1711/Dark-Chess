import React from 'react'
// Page shown when there is checkmate on the board
const CheckMate = ({result}) => {
  return (
    <div className='w-[100px] h-[100px] bg-white'>
      CheckMate {result === 'w' ? 'white' : 'black'} wins
    </div>
  )
}

export default CheckMate

  