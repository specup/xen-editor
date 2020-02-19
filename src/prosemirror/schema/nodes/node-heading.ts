import { NodeSpec } from 'prosemirror-model'
import * as block from './block'

function makeGetAttrs(level: number) {
  return (element: HTMLElement) => ({ ...block.getAttrs(element), level })
}

export const heading: NodeSpec = {
  attrs: {
    ...block.attrs,
    level: { default: 1 },
  },
  content: 'inline*',
  group: 'block',
  defining: true,
  parseDOM: [
    { tag: 'h1', getAttrs: makeGetAttrs(1) },
    { tag: 'h2', getAttrs: makeGetAttrs(2) },
    { tag: 'h3', getAttrs: makeGetAttrs(3) },
    { tag: 'h4', getAttrs: makeGetAttrs(4) },
    { tag: 'h5', getAttrs: makeGetAttrs(5) },
    { tag: 'h6', getAttrs: makeGetAttrs(6) },
  ],
  toDOM(node) {
    const h = 'h' + node.attrs.level
    return [h, { ...block.style(node) }, 0]
  },
}
