import React, { FunctionComponent, useCallback } from 'react'
import { useProseMirror } from '../../prosemirror'
import { IndentIcon, OutdentIcon } from '../icons'
import { indent } from '../../prosemirror/commands'
import { Buttons, MenuButton } from './base'

const INDENT_MARGIN = 48 // From google docs

const indentCommand = indent(INDENT_MARGIN)
const outdentCommand = indent(-INDENT_MARGIN)

const MenuListIndent: FunctionComponent = () => {
  const { applyCommand } = useProseMirror()

  const handleIndentClick = useCallback(() => {
    applyCommand(indentCommand)
  }, [applyCommand])

  const handleOutdentClick = useCallback(() => {
    applyCommand(outdentCommand)
  }, [applyCommand])

  return (
    <Buttons>
      <MenuButton onClick={handleIndentClick}>
        <IndentIcon />
      </MenuButton>
      <MenuButton onClick={handleOutdentClick}>
        <OutdentIcon />
      </MenuButton>
    </Buttons>
  )
}

export default MenuListIndent
