// https://bitbucket.org/atlassian/atlaskit-mk-2/src/bc5426962e3d6751f0e23450fadf81d631cd74b6/packages/editor/editor-core/src/commands/index.ts#packages/editor/editor-core/src/commands/index.ts-292
import { Node as PMNode, NodeType, MarkType, Schema } from 'prosemirror-model'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { CellSelection } from 'prosemirror-tables'

export type CommandDispatch = (tr: Transaction) => void
export type Command = (
  state: EditorState,
  dispatch?: CommandDispatch,
  view?: EditorView,
) => boolean | void

export const createToggleBlockMarkOnRange = <T = object>(
  markType: MarkType,
  getAttrs: (prevAttrs?: T, node?: PMNode) => T | undefined | false,
  allowedBlocks?:
    | Array<NodeType>
    | ((schema: Schema, node: PMNode, parent: PMNode) => boolean),
) => (
  from: number,
  to: number,
  tr: Transaction,
  state: EditorState,
): boolean => {
  let markApplied = false
  state.doc.nodesBetween(from, to, (node, pos, parent) => {
    if (!node.type.isBlock) {
      return false
    }

    if (
      (!allowedBlocks ||
        (Array.isArray(allowedBlocks)
          ? allowedBlocks.indexOf(node.type) > -1
          : allowedBlocks(state.schema, node, parent))) &&
      parent.type.allowsMarkType(markType)
    ) {
      const oldMarks = node.marks.filter(mark => mark.type === markType)

      const prevAttrs = oldMarks.length ? (oldMarks[0].attrs as T) : undefined
      const newAttrs = getAttrs(prevAttrs, node)

      if (newAttrs !== undefined) {
        tr.setNodeMarkup(
          pos,
          node.type,
          node.attrs,
          node.marks
            .filter(mark => !markType.excludes(mark.type))
            .concat(newAttrs === false ? [] : markType.create(newAttrs)),
        )
        markApplied = true
      }
    }
  })
  return markApplied
}

/**
 * Toggles block mark based on the return type of `getAttrs`.
 * This is similar to ProseMirror's `getAttrs` from `AttributeSpec`
 * return `false` to remove the mark.
 * return `undefined for no-op.
 * return an `object` to update the mark.
 */
export const toggleBlockMark = <T = object>(
  markType: MarkType,
  getAttrs: (prevAttrs?: T, node?: PMNode) => T | undefined | false,
  allowedBlocks?:
    | Array<NodeType>
    | ((schema: Schema, node: PMNode, parent: PMNode) => boolean),
): Command => (state, dispatch) => {
  let markApplied = false
  const tr = state.tr

  const toggleBlockMarkOnRange = createToggleBlockMarkOnRange(
    markType,
    getAttrs,
    allowedBlocks,
  )

  if (state.selection instanceof CellSelection) {
    state.selection.forEachCell((cell, pos) => {
      markApplied = toggleBlockMarkOnRange(pos, pos + cell.nodeSize, tr, state)
    })
  } else {
    const { from, to } = state.selection
    markApplied = toggleBlockMarkOnRange(from, to, tr, state)
  }

  if (markApplied && tr.docChanged) {
    if (dispatch) {
      dispatch(tr.scrollIntoView())
    }
    return true
  }

  return false
}
