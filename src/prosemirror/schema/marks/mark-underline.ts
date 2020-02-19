import { MarkSpec, DOMOutputSpec } from 'prosemirror-model'

const uDOM: DOMOutputSpec = ['u', 0]

export const u: MarkSpec = {
  parseDOM: [
    { tag: 'u' },
    { style: 'text-decoration: underline' },
  ],
  toDOM() {
    return uDOM
  },
}
