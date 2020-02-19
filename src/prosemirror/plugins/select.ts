// Refer to:
// - https://discuss.prosemirror.net/t/keeping-selection-while-using-the-menu-or-clicking-outside-the-document/578
// - https://discuss.prosemirror.net/t/handling-focus-in-plugins/1981

import { Decoration, DecorationSet } from 'prosemirror-view'
import { Plugin, PluginKey, Transaction, EditorState } from 'prosemirror-state'

const key = new PluginKey('selection-highlight')

function decorationsReducer(
  transaction: Transaction,
  state: DecorationSet,
  editorState: EditorState,
): DecorationSet {
  if (!transaction.docChanged && !transaction.selectionSet) {
    return state
  }

  const { selection } = transaction
  return DecorationSet.create(editorState.doc, [
    Decoration.inline(selection.$from.pos, selection.$to.pos, {
      class: 'selection-marker',
    }),
  ])
}

function focusedReducer(transaction: Transaction, state: boolean) {
  // update plugin state when transaction contains the meta property
  // set by the focus/blur DOM event handlers
  const focused = transaction.getMeta(key)
  return typeof focused === 'boolean' ? focused : state
}

const SelectPlugin = new Plugin({
  state: {
    init(config, instance) {
      return {
        decorations: DecorationSet.empty,
        focused: false,
      }
    },
    apply(transaction, state, prevEditorState, editorState) {
      const decorations = decorationsReducer(
        transaction,
        state.decorations,
        editorState,
      )
      const focused = focusedReducer(transaction, state.focused)

      if (state.decorations === decorations && state.focused === focused) {
        return state
      }

      return {
        decorations,
        focused,
      }
    },
  },
  props: {
    handleDOMEvents: {
      blur(view) {
        view.dispatch(view.state.tr.setMeta(key, false))
        return false
      },
      focus(view) {
        view.dispatch(view.state.tr.setMeta(key, true))
        return false
      },
    },
    decorations(this: Plugin, state) {
      if (!state) {
        return null
      }

      const pluginState = this.getState(state)
      if (
        !pluginState ||
        // decorations prevent IE drag-selection, so disable decorations when editor is focused
        pluginState.focused
      ) {
        return null
      }

      return pluginState.decorations
    },
  },
})

export default SelectPlugin
