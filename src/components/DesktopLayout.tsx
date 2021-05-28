import React, { FunctionComponent, FocusEventHandler } from 'react'
import { Menu } from './Editor'
import MenuBar from './menu/MenuBar'

interface DesktopLayoutProps {
  className?: string
  menuClassName?: string
  onFocus?: FocusEventHandler<HTMLDivElement>
  onBlur?: FocusEventHandler<HTMLDivElement>
  menus?: Menu[]
}

const DesktopLayout: FunctionComponent<DesktopLayoutProps> = ({
  className,
  menuClassName,
  children,
  onFocus,
  onBlur,
  menus,
}) => {
  return (
    <div className={className} onFocus={onFocus} onBlur={onBlur}>
      <MenuBar className={menuClassName} menus={menus} />
      {children}
    </div>
  )
}

export default DesktopLayout
