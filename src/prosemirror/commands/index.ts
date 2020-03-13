import { Node, Attrs } from '../../prosemirror'
import { Command } from './base'
export * from './base'
export * from './alignment'

function setAttrs(
  predicate: (node: Node) => boolean,
  update: (node: Node) => Attrs,
): Command {
  return (state, dispatch) => {
    const { from, to } = state.selection

    const tr = state.tr
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (!predicate(node)) {
        return
      }

      tr.setNodeMarkup(pos, undefined, {
        ...node.attrs,
        ...update(node),
      })
    })

    if (dispatch) {
      dispatch(tr)
    }

    return true
  }
}

export function indent(margin: number) {
  return setAttrs(
    node => {
      const { attrs } = node.type.spec
      return attrs ? !!attrs.indentation : false
    },
    node => {
      const indentation = node.attrs.indentation || 0
      const nextIndentation = Math.max(0, indentation + margin)
      return {
        indentation: nextIndentation || null,
      }
    },
  )
}

export function setLineHeight(lineHeight: number) {
  return setAttrs(
    node => {
      const { attrs } = node.type.spec
      return attrs ? !!attrs.lineHeight : false
    },
    () => ({ lineHeight }),
  )
}

export function insertNode(node: Node): Command {
  return (state, dispatch) => {
    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(node))
    }
    return true
  }
}
