import React, {
  FunctionComponent,
  useCallback,
  useRef,
  FocusEventHandler,
} from 'react'
import { styled } from '@material-ui/core/styles'
import MenuItemInsertImage, {
  MenuItemInsertImageAPI,
} from './menu/MenuItemInsertImage'
import MenuItemInsertYoutube from './menu/MenuItemInsertYoutube'
import { ImageLargeIcon, YoutubeLargeIcon } from './icons'

const Root = styled('div')({
  borderTop: '1px solid #e8e8e8',
  borderBottom: '1px solid #e8e8e8',
  paddingTop: 10,
  paddingBottom: 10,
  display: 'flex',
  paddingLeft: 10,
})

interface MobileLayoutProps {
  className?: string
  onFocus?: FocusEventHandler<HTMLDivElement>
  onBlur?: FocusEventHandler<HTMLDivElement>
}

const IconButton = styled('button')({
  padding: 3,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 5,
  borderRadius: '50%',
  backgroundColor: 'white',
  border: 'none',
  cursor: 'pointer',

  '& svg': {
    width: 40,
    height: 40,
  }
})

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
