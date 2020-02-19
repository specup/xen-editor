import { NodeSpec, DOMOutputSpec } from 'prosemirror-model'

const hrDOM: DOMOutputSpec = ['hr']

export const horizontal_rule: NodeSpec = {
  group: 'block',
  parseDOM: [
    { tag: 'hr' },
  ],
  toDOM() {
    return hrDOM
  }
}
