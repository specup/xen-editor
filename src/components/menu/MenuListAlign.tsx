import React, { FunctionComponent, useCallback } from 'react'
import { findParentNodeOfType } from 'prosemirror-utils'
import { CellSelection } from 'prosemirror-tables'
import { useProseMirrorState, EditorState } from '../../prosemirror'
import { AlignmentState } from '../../prosemirror/schema/marks/mark-alignment'
import { changeAlignment } from '../../prosemirror/commands/alignment'
import {
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  AlignJustifyIcon,
} from '../icons'
import { Buttons, MenuButton } from './base'

function getAlignment(state: EditorState) {
  if (state.selection instanceof CellSelection) {
    const marks: string[] = []
    state.selection.forEachCell(cell => {
      const mark = cell.firstChild!.marks.filter(
        mark => mark.type === state.schema.marks.alignment,
      )[0]
      marks.push(mark ? mark.attrs.align : 'left')
    })
    return marks.every(mark => mark === marks[0])
      ? (marks[0] as AlignmentState)
      : 'left'
  }
  const node = findParentNodeOfType([
    state.schema.nodes.paragraph,
    state.schema.nodes.heading,
  ])(state.selection)
  const getMark =
    node &&
    node.node.marks.filter(
      mark => mark.type === state.schema.marks.alignment,
    )[0]

  return (getMark && getMark.attrs.align) || 'left'
}

interface AlignItems {
  align: AlignmentState
  icon: React.ReactNode
}
const ALIGN_LIST: AlignItems[] = [
  { align: 'left', icon: <AlignLeftIcon /> },
  { align: 'center', icon: <AlignCenterIcon /> },
  { align: 'right', icon: <AlignRightIcon /> },
  { align: 'justify', icon: <AlignJustifyIcon /> },
]

const MenuListAlign: FunctionComponent = () => {
  const [currentSelectionAlignment, applyCommand] = useProseMirrorState(
    getAlignment,
  )

  const handleAlignClick = useCallback(
    align => {
      applyCommand(changeAlignment(align))
    },
    [applyCommand],
  )

  return (
    <Buttons>
      {ALIGN_LIST.map(({ align, icon }) => (
        <MenuButton
          key={align}
          active={currentSelectionAlignment === align}
          onClick={() => handleAlignClick(align)}
        >
          {icon}
        </MenuButton>
      ))}
    </Buttons>
  )
}

export default MenuListAlign
