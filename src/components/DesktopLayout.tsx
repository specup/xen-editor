import React, { FunctionComponent } from 'react'
import MenuBar from './menu/MenuBar'

interface DesktopLayoutProps {
  className?: string
  menuClassName?: string
}

const DesktopLayout: FunctionComponent<DesktopLayoutProps> = ({ className, menuClassName, children }) => {
  return (
    <div className={className}>
      <MenuBar className={menuClassName} />
      {children}
    </div>
  )
}

export default DesktopLayout
