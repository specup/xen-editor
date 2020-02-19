import { MarkSpec, DOMOutputSpec } from 'prosemirror-model'

const emDOM: DOMOutputSpec = ['em', 0]

export const em: MarkSpec = {
  parseDOM: [
    { tag: 'i' },
    { tag: 'em' },
    { style: 'font-style=italic' },
  ],
  toDOM() {
    return emDOM
  },
}
