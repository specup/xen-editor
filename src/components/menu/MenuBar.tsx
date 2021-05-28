import React, { FunctionComponent, useCallback, useRef } from 'react'
import { styled } from '@material-ui/core/styles'
import { ImageIcon, YoutubeIcon } from '../icons'
import MenuItemFontFamily from './MenuItemFontFamily'
import MenuItemFontSize from './MenuItemFontSize'
import MenuListTextDecoration from './MenuListTextDecoration'
import MenuListColor from './MenuListColor'
import MenuListAlign from './MenuListAlign'
import MenuListIndent from './MenuListIndent'
import MenuItemLineHeight from './MenuItemLineHeight'
import MenuItemInsertImage, {
  MenuItemInsertImageAPI,
} from './MenuItemInsertImage'
import MenuItemInsertYoutube from './MenuItemInsertYoutube'
import MenuItemLink from './MenuItemLink'
import { Buttons, MenuButton } from './base'
import { Menu, MenuItem } from 'components/Editor'

const MenuRoot = styled('div')({
  display: 'flex',
  margin: '10px 0',
})

const MenuSection = styled('div')({
  display: 'inline-block',
  padding: '0 10px',

  '& + &': {
    borderLeft: '1px solid #dbdbdb',
  },
})

interface MenuBarProps {
  className?: string
  menus?: Menu[]
}

const MenuItemInsertImageContainer: FunctionComponent = () => {
  const apiRef = useRef<MenuItemInsertImageAPI>(null)

  const handleClick = useCallback(() => {
    if (!apiRef.current) {
      return
    }
    apiRef.current.openDialog()
  }, [])

  return (
    <>
      <MenuButton onClick={handleClick}>
        <ImageIcon />
      </MenuButton>
      <MenuItemInsertImage ref={apiRef} />
    </>
  )
}

function renderInsertYoutube(onClick: () => any) {
  return (
    <MenuButton onClick={onClick}>
      <YoutubeIcon />
    </MenuButton>
  )
}

interface MenuComponentProps {
  menu: MenuItem
}

const MenuComponent: FunctionComponent<MenuComponentProps> = ({ menu }) => {
  const components = {
    FontFamily: MenuItemFontFamily,
    FontSize: MenuItemFontSize,
    TextDecoration: MenuListTextDecoration,
    Color: MenuListColor,
    Align: MenuListAlign,
    Indent: MenuListIndent,
    LineHeight: MenuItemLineHeight,
    InsertImage: MenuItemInsertImageContainer,
    InsertYoutube: MenuItemInsertYoutube,
    Link: MenuItemLink,
  }
  const MenuComponent = components[menu]
  return <MenuComponent render={renderInsertYoutube} />
}

const MenuBar: FunctionComponent<MenuBarProps> = ({ className, menus }) => {
  if (menus?.length && menus?.length > 0) {
    return (
      <MenuRoot className={className}>
        {menus.map((menu, index) => {
          if (typeof menu === 'string') {
            return (
              <MenuSection key={`MenuSection-${index}`}>
                <MenuComponent menu={menu} />
              </MenuSection>
            )
          } else {
            return (
              <MenuSection key={`MenuSection-${index}`}>
                <Buttons>
                  {menu.map((item, index) => {
                    return (
                      <MenuComponent
                        key={`MenuComponent-${index}`}
                        menu={item}
                      />
                    )
                  })}
                </Buttons>
              </MenuSection>
            )
          }
        })}
      </MenuRoot>
    )
  }
  return (
    <MenuRoot className={className}>
      <MenuSection>
        <MenuItemFontFamily />
      </MenuSection>
      <MenuSection>
        <MenuItemFontSize />
      </MenuSection>
      <MenuSection>
        <MenuListTextDecoration />
      </MenuSection>
      <MenuSection>
        <MenuListColor />
      </MenuSection>
      <MenuSection>
        <MenuListAlign />
        <MenuListIndent />
        <Buttons>
          <MenuItemLineHeight />
        </Buttons>
      </MenuSection>
      <MenuSection>
        <Buttons>
          <MenuItemInsertImageContainer />
          <MenuItemInsertYoutube render={renderInsertYoutube} />
          <MenuItemLink />
        </Buttons>
      </MenuSection>
    </MenuRoot>
  )
}

export default MenuBar
