import React, {
  FunctionComponent,
  useCallback,
  useRef,
  FocusEventHandler,
} from 'react'
import styled from 'styled-components'
import MenuItemInsertImage, {
  MenuItemInsertImageAPI,
} from './menu/MenuItemInsertImage'
import MenuItemInsertYoutube from './menu/MenuItemInsertYoutube'
import { ImageLargeIcon, YoutubeLargeIcon } from './icons'

const Root = styled.div`
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  padding-left: 10px;
`

interface MobileLayoutProps {
  className?: string
  onFocus?: FocusEventHandler<HTMLDivElement>
  onBlur?: FocusEventHandler<HTMLDivElement>
}

const IconButton = styled.button`
  /* width: 30px;
  height: 30px; */
  padding: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 5px;
  border-radius: 50%;
  background-color: white;
  border: none;
  cursor: pointer;

  svg {
    width: 40px;
    height: 40px;
  }
`

const MenuItemInsertImageContainer: FunctionComponent = () => {
  const apiRef = useRef<MenuItemInsertImageAPI | null>(null)

  const handleClick = useCallback(() => {
    if (!apiRef.current) {
      return
    }
    apiRef.current.clickFileInput()
  }, [])

  return (
    <>
      <IconButton type="button" onClick={handleClick}>
        <ImageLargeIcon />
      </IconButton>
      <MenuItemInsertImage ref={apiRef} />
    </>
  )
}

function renderInsertYoutube(onClick: () => any) {
  return (
    <IconButton type="button" onClick={onClick}>
      <YoutubeLargeIcon />
    </IconButton>
  )
}

const MobileLayout: FunctionComponent<MobileLayoutProps> = ({
  className,
  onFocus,
  onBlur,
  children,
}) => {
  return (
    <div className={className} onFocus={onFocus} onBlur={onBlur}>
      {children}
      <Root>
        <MenuItemInsertImageContainer />
        <MenuItemInsertYoutube render={renderInsertYoutube} />
      </Root>
    </div>
  )
}

export default MobileLayout
