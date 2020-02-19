import { NodeSpec, DOMOutputSpec } from 'prosemirror-model'

const brDOM: DOMOutputSpec = ['br']

export const hard_break: NodeSpec = {
  inline: true,
  group: 'inline',
  selectable: false,
  parseDOM: [
    { tag: 'br' },
  ],
  toDOM() {
    return brDOM
  },
}
