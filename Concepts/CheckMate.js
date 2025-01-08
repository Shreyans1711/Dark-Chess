import React from 'react'

const CheckMate = ({result}) => {
  return (
    <div className='w-[100px] h-[100px] bg-white'>
      CheckMate {result === 'w' ? 'white' : 'black'} wins
    </div>
  )
}

export default CheckMate

  