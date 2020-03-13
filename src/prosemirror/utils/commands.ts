import { DOMParser } from 'prosemirror-model'
import { EditorState, AllSelection } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import schema from '../schema'
import { Command } from '../commands'

type Predicate = (state: EditorState, view?: EditorView) => boolean

export const filter = (
  predicates: Predicate[] | Predicate,
  cmd: Command,
): Command => {
  return function(state, dispatch, view): boolean {
    if (!Array.isArray(predicates)) {
      predicates = [predicates]
    }

    if (predicates.some(pred => !pred(state, view))) {
      return false
    }

    return cmd(state, dispatch, view) || false
  }
}

function htmlToNode(html: string) {
  const el = document.createElement('div')
  el.innerHTML = html

  return DOMParser.fromSchema(schema).parse(el)
}

export function setContent(html: string): Command {
  return (state, dispatch) => {
    const node = htmlToNode(html)
    const tr = state.tr
      .setSelection(new AllSelection(state.doc))
      .replaceSelectionWith(node)

    if (dispatch) {
      dispatch(tr)
    }

    return true
  }
}

export function appendContent(html: string): Command {
  return (state, dispatch) => {
    const node = htmlToNode(html)
    const tr = state.tr.insert(0, node)

    if (dispatch) {
      dispatch(tr)
    }

    return true
  }
}

export const clearState: Command = (state, dispatch) => {
  if (dispatch) {
    dispatch(
      state.tr.setSelection(new AllSelection(state.doc)).deleteSelection(),
    )
  }
  return true
}
