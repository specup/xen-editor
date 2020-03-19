import React, { FunctionComponent } from 'react'
import { styled } from '@material-ui/core/styles'

const Root = styled('div')({
  position: 'fixed',
  right: 0,
  bottom: 0,
  top: 0,
  left: 0,
  WebkitTapHighlightColor: 'transparent',
  touchAction: 'none',
  backgroundColor: 'transparent',
})

interface BackdropProps {
  onMouseDown: () => any
}

const Backdrop: FunctionComponent<BackdropProps> = ({ onMouseDown }) => {
  return (
    <Root
      aria-hidden
      onMouseDown={onMouseDown}
    />
  )
}

export default Backdrop
