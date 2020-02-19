import { NodeSpec } from 'prosemirror-model'
import * as block from './block'

export const blockquote: NodeSpec = {
  content: 'block+',
  group: 'block',
  attrs: block.attrs,
  defining: true,
  parseDOM: [
    { tag: 'blockquote', getAttrs: block.getAttrs },
  ],
  toDOM(node) {
    return ['blockquote', { ...block.style(node) }, 0]
  }
}
