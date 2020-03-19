import React, { CSSProperties, forwardRef, RefForwardingComponent } from 'react'
import { styled } from '@material-ui/core/styles'
import Backdrop from './Backdrop'

const OverlayRoot = styled('div')({
  position: 'absolute',
})

interface OverlayProps {
  open: boolean
  onClose: () => any
  className?: string
  style?: CSSProperties
  children: React.ReactNode
}

const Overlay: RefForwardingComponent<HTMLDivElement, OverlayProps> = ({ open, onClose, className, style, children }, ref) => {
  return (
    <OverlayRoot className={className} style={style} ref={ref}>
      {open && (
        <>
          <Backdrop onMouseDown={onClose} />
          {children}
        </>
      )}
    </OverlayRoot>
  )
}

export default forwardRef(Overlay)
