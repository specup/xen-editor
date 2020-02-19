import { MarkSpec, DOMOutputSpec } from 'prosemirror-model'

const sDOM: DOMOutputSpec = ['s', 0]

export const s: MarkSpec = {
  parseDOM: [
    { tag: 's' },
    { style: 'text-decoration: line-through' },
  ],
  toDOM() {
    return sDOM
  },
}
