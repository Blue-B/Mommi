import React from 'react'
import PinItem from './PinItem'
import Masonry from 'react-masonry-css'

const breakpointColumnsObj = {
  default: 5,
  1600: 4,
  1200: 3,
  800: 2,
  500: 1
};

function PinList({listOfPins}) {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="my-masonry-grid"
      columnClassName="my-masonry-grid_column"
    >
      {listOfPins.map((item) => (
        <PinItem key={`${item.id}-${item.title}`} pin={item} />
      ))}
    </Masonry>
  )
}

export default PinList