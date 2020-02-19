import React, { FunctionComponent, useState, useCallback } from 'react'
import { SketchPicker } from 'react-color'
import styled from 'styled-components'
import { useProseMirrorState, schema } from '../../prosemirror'
import { ColorTextIcon, ColorBackgroundIcon } from '../icons'
import { getFontColor, getBackgroundColor, setMark } from './utils'
import Overlay from './Overlay'
import { Buttons, MenuButton } from './base'

const StyledOverlay = styled(Overlay)`
  margin-top: 4px;
`

const MenuItemTextColor: FunctionComponent = () => {
  const [color, applyCommand] = useProseMirrorState(getFontColor)
  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => {
    setOpen(!open)
  }, [open])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleColorChange = useCallback(({ hex }) => {
    applyCommand(setMark(schema.marks.font_color, { color: hex }))
  }, [applyCommand])

  return (
    <>
      <MenuButton onClick={handleClick}>
        <ColorTextIcon circleStyle={{ fill: color || 'rgba(0, 0, 0, 0)' }} />
      </MenuButton>
      <StyledOverlay open={open} onClose={handleClose}>
        <SketchPicker
          color={color || '#4a4a4a'}
          onChangeComplete={handleColorChange}
        />
      </StyledOverlay>
    </>
  )
}

const MenuItemBackgroundColor: FunctionComponent = () => {
  const [color, applyCommand] = useProseMirrorState(getBackgroundColor)
  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => {
    setOpen(!open)
  }, [open])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleColorChange = useCallback(({ hex }) => {
    applyCommand(setMark(schema.marks.background_color, { color: hex }))
  }, [applyCommand])

  return (
    <>
      <MenuButton onClick={handleClick}>
        <ColorBackgroundIcon squareStyle={{ fill: color || 'rgba(0, 0, 0, 0)' }} />
      </MenuButton>
      <StyledOverlay open={open} onClose={handleClose}>
        <SketchPicker
          color={color || '#fff'}
          onChangeComplete={handleColorChange}
        />
      </StyledOverlay>
    </>
  )
}

const MenuListColor: FunctionComponent = () => {
  return (
    <Buttons>
      <MenuItemTextColor />
      <MenuItemBackgroundColor />
    </Buttons>
  )
}

export default MenuListColor
