import React, { FunctionComponent, FocusEventHandler } from 'react'
import MenuBar from './menu/MenuBar'

interface DesktopLayoutProps {
  className?: string
  menuClassName?: string
  onFocus?: FocusEventHandler<HTMLDivElement>
  onBlur?: FocusEventHandler<HTMLDivElement>
}

const DesktopLayout: FunctionComponent<DesktopLayoutProps> = ({
  className,
  menuClassName,
  children,
  onFocus,
  onBlur,
}) => {
  return (
    <div className={className} onFocus={onFocus} onBlur={onBlur}>
      <MenuBar className={menuClassName} />
      {children}
    </div>
  )
}

export default DesktopLayout
