import React from 'react'
import WR from '../assets/Pieces/White/wr.png'
import WN from '../assets/Pieces/White/wn.png'
import WB from '../assets/Pieces/White/wb.png'
import WQ from '../assets/Pieces/White/wq.png'
import WK from '../assets/Pieces/White/wk.png'
import WP from '../assets/Pieces/White/wp.png'

import BR from '../assets/Pieces/Black/br.png'
import BN from '../assets/Pieces/Black/bn.png'
import BB from '../assets/Pieces/Black/bb.png'
import BQ from '../assets/Pieces/Black/bq.png'
import BK from '../assets/Pieces/Black/bk.png'
import BP from '../assets/Pieces/Black/bp.png'

const Pieces = ({r, c}) => {
  return (
    <div className='bg-inherit'>
      {/* White Pieces */}
      {(r === 7 && (c === 0 || c === 7)) && (
          <img src= {WR} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 7 && (c === 1 || c === 6)) && (
          <img src= {WN} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 7 && (c === 2 || c === 5)) && (
          <img src= {WB} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 7 && (c === 3)) && (
          <img src= {WQ} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 7 && (c === 4)) && (
          <img src= {WK} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 6) && (
          <img src= {WP} alt="" className='bg-inherit cursor-pointer' />
      )}
      {/* Black Pieces */}
      {(r === 0 && (c === 0 || c === 7)) && (
          <img src= {BR} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 0 && (c === 1 || c === 6)) && (
          <img src= {BN} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 0 && (c === 2 || c === 5)) && (
          <img src= {BB} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 0 && (c === 3)) && (
          <img src= {BQ} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 0 && (c === 4)) && (
          <img src= {BK} alt="" className='bg-inherit cursor-pointer' />
      )}
      {(r === 1) && (
          <img src= {BP} alt="" className='bg-inherit cursor-pointer' />
      )}
    </div>
  )
}

export default Pieces
