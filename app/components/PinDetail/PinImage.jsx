import Image from 'next/image'
import React from 'react'

function PinImage({pinDetail}) {
  if (!pinDetail?.image) {
    return null;
  }

  return (
    <div>
      <Image src={pinDetail.image}
      alt={pinDetail.title}
      width={0}
      height={0}
      sizes="100vw"
      className='rounded-2xl w-full h-auto'
      style={{ objectFit: 'contain' }}
      />
    </div>
  )
}

export default PinImage