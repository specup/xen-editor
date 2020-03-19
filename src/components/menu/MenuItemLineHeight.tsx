import React, { FunctionComponent, useState, useCallback } from 'react'
import cn from 'clsx'
import { useProseMirrorState, EditorState } from '../../prosemirror'
import { LineHeightIcon } from '../icons'
import Overlay from './Overlay'
import { MenuButton, Dropdown } from './base'
import { getNodeUniqueValue } from './utils'
import { setLineHeight } from '../../prosemirror/commands'

function getLineHeight(state: EditorState) {
  return getNodeUniqueValue(state, node => {
    return node.attrs.lineHeight !== undefined
      ? node.attrs.lineHeight || 1.5
      : undefined
  })
}

const setLineHeight_1 = setLineHeight(1)
const setLineHeight_1_15 = setLineHeight(1.15)
const setLineHeight_1_5 = setLineHeight(1.5)
const setLineHeight_2 = setLineHeight(2)

const MenuListLineHeight: FunctionComponent = () => {
  const [open, setOpen] = useState(false)
  const [lineHeight, applyCommand] = useProseMirrorState(getLineHeight)

  const handleClick = useCallback(() => {
    setOpen(!open)
  }, [open])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleClick_1 = useCallback(() => {
    applyCommand(setLineHeight_1)
  }, [applyCommand])

  const handleClick_1_15 = useCallback(() => {
    applyCommand(setLineHeight_1_15)
  }, [applyCommand])

  const handleClick_1_5 = useCallback(() => {
    applyCommand(setLineHeight_1_5)
  }, [applyCommand])

  const handleClick_2 = useCallback(() => {
    applyCommand(setLineHeight_2)
  }, [applyCommand])

  return (
    <>
      <MenuButton onClick={handleClick}>
        <LineHeightIcon />
      </MenuButton>
      <Overlay open={open} onClose={handleClose}>
        <Dropdown className={'dropdown is-active'}>
          <div className="dropdown-menu" id="dropdown-menu" role="menu">
            <div className="dropdown-content">
              <a
                className={cn('dropdown-item', {
                  'is-active': lineHeight === 1,
                })}
                onClick={handleClick_1}
              >
                한 줄 간격
              </a>
              <a
                className={cn('dropdown-item', {
                  'is-active': lineHeight === 1.15,
                })}
                onClick={handleClick_1_15}
              >
                1.15
              </a>
              <a
                className={cn('dropdown-item', {
                  'is-active': lineHeight === 1.5,
                })}
                onClick={handleClick_1_5}
              >
                1.5
              </a>
              <a
                className={cn('dropdown-item', {
                  'is-active': lineHeight === 2,
                })}
                onClick={handleClick_2}
              >
                두 줄 간격
              </a>
            </div>
          </div>
        </Dropdown>
      </Overlay>
    </>
  )
}

export default MenuListLineHeight
