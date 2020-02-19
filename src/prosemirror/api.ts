import { DOMSerializer } from 'prosemirror-model'
import { ProseMirrorInstance, EditorView } from './core'
import schema from './schema'
import { Fragment } from './types'

function fragmentToDOM(fragment: Fragment) {
  const serializer = DOMSerializer.fromSchema(schema)
  return serializer.serializeFragment(fragment)
}

function domToString(dom: DocumentFragment) {
  const div = document.createElement('div')
  div.appendChild(dom)

  return div.innerHTML
}

function getDOM(view: EditorView) {
  return fragmentToDOM(view.state.doc.content)
}

function getHTML(view: EditorView) {
  const dom = fragmentToDOM(view.state.doc.content)
  return domToString(dom)
}

function isViewEmpty(view: EditorView) {
  const { childCount } = view.state.doc
  if (childCount === 0) {
    return true
  }

  if (childCount > 1) {
    return false
  }

  const { firstChild } = view.state.doc

  if (!firstChild) {
    return true
  }

  if (firstChild.type.name !== 'paragraph' || firstChild.childCount > 0) {
    return false
  }

  return true
}

export interface EditorAPI {
  view(): EditorView | null
  html(): string | null
  dom(): DocumentFragment | null
  isEmpty(): boolean
  isDirty(): boolean
}

export function createAPI(instance: ProseMirrorInstance | null): EditorAPI {
  return {
    view() {
      return instance && instance.view
    },
    dom() {
      const view = instance && instance.view
      return view && getDOM(view)
    },
    html() {
      const view = instance && instance.view
      return view && getHTML(view)
    },
    isEmpty() {
      const view = instance && instance.view
      return view ? isViewEmpty(view) : true
    },
    isDirty() {
      if (!instance) {
        return false
      }
      const { view, initialState } = instance
      return view.state !== initialState
    },
  }
}
