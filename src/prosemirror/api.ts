import { RefObject } from 'react'
import { DOMSerializer } from 'prosemirror-model'
import { Schema as BaseSchema } from 'prosemirror-model'
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

function linebreak(str) {
  const output = str.replace(/<\s?(p|br)[^<]*>/gi, function(x, tag) {
    switch (tag.toLowerCase()) {
      case 'p':
        return '\n'
      case 'br':
        return '\n'
    }

    return x
  })

  return output
}

function getDOM(view: EditorView) {
  return fragmentToDOM(view.state.doc.content)
}

function getHTML(view: EditorView) {
  const dom = fragmentToDOM(view.state.doc.content)
  return domToString(dom)
}

function getText(view: EditorView) {
  const html = getHTML(view)

  const tmp = document.implementation.createHTMLDocument('New').body
  tmp.innerHTML = linebreak(String(html))

  return tmp.innerText || ''
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
  text(): string | null
  dom(): DocumentFragment | null
  isEmpty(): boolean
  isDirty(): boolean
}

export function createAPI(ref: RefObject<ProseMirrorInstance>): EditorAPI {
  return {
    view() {
      return ref.current?.view ?? null
    },
    dom() {
      const view = this.view()
      return view && getDOM(view)
    },
    html() {
      const view = this.view()
      return view && getHTML(view)
    },
    text() {
      const view = this.view()
      return view && getText(view)
    },
    isEmpty() {
      const view = this.view()
      return view ? isViewEmpty(view) : true
    },
    isDirty() {
      if (!ref.current) {
        return false
      }
      const { view, initialState } = ref.current
      return view.state !== initialState
    },
  }
}
