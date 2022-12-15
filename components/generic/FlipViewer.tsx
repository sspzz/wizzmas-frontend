import { ReactNode, useState } from 'react'
import styled from 'styled-components'

type FlipViewerProps = {
  items: any[]
  renderItem: (item: any) => ReactNode
  //onFlipped: (flipped: any) => void;
}
const FlipViewer = ({ items, renderItem }: FlipViewerProps) => {
  return (
    <>
      {items.map((item) => (
        <div>
          <Front>{renderItem(item)}</Front>
        </div>
      ))}
    </>
  )
}

const Front = styled.div`
  cursor: pointer;
`

export default FlipViewer
