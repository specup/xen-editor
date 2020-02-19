import { MarkSpec, DOMOutputSpec } from 'prosemirror-model'

const codeDOM: DOMOutputSpec = ['code', 0]

export const code: MarkSpec = {
  parseDOM: [
    { tag: 'code' },
  ],
  toDOM() {
    return codeDOM
  },
}
