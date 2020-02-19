import React, { FunctionComponent, useCallback } from 'react'
import { toggleMark } from 'prosemirror-commands'
import { useProseMirrorState, schema } from '../../prosemirror'
import { BoldIcon, UnderlineIcon, ItalicIcon, StrikeIcon } from '../icons'
import { markActive } from './utils'
import { Buttons, MenuButton } from './base'

// bold

const toggleBold = toggleMark(schema.marks.strong)

const MenuItemBold: FunctionComponent = () => {
  const [active, applyCommand] = useProseMirrorState(state => markActive(state, schema.marks.strong))

  const handleClick = useCallback(() => {
    applyCommand(toggleBold)
  }, [applyCommand])

  return (
    <MenuButton active={active} onClick={handleClick}>
      <BoldIcon />
    </MenuButton>
  )
}

// underline

const toggleUnderline = toggleMark(schema.marks.u)

const MenuItemUnderline: FunctionComponent = () => {
  const [active, applyCommand] = useProseMirrorState(state => markActive(state, schema.marks.u))

  const handleClick = useCallback(() => {
    applyCommand(toggleUnderline)
  }, [applyCommand])

  return (
    <MenuButton active={active} onClick={handleClick}>
      <UnderlineIcon />
    </MenuButton>
  )
}

// italic

const toggleItalic = toggleMark(schema.marks.em)

const MenuItemItalic: FunctionComponent = () => {
  const [active, applyCommand] = useProseMirrorState(state => markActive(state, schema.marks.em))

  const handleClick = useCallback(() => {
    applyCommand(toggleItalic)
  }, [applyCommand])

  return (
    <MenuButton active={active} onClick={handleClick}>
      <ItalicIcon />
    </MenuButton>
  )
}

// strike

const toggleStrike = toggleMark(schema.marks.s)

const MenuItemStrike: FunctionComponent = () => {
  const [active, applyCommand] = useProseMirrorState(state => markActive(state, schema.marks.s))

  const handleClick = useCallback(() => {
    applyCommand(toggleStrike)
  }, [applyCommand])

  return (
    <MenuButton active={active} onClick={handleClick}>
      <StrikeIcon />
    </MenuButton>
  )
}

const MenuListTextDecoration: FunctionComponent = () => {
  return (
    <Buttons>
      <MenuItemBold />
      <MenuItemUnderline />
      <MenuItemItalic />
      <MenuItemStrike />
    </Buttons>
  )
}

export default MenuListTextDecoration
