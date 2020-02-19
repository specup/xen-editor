import { MarkSpec } from 'prosemirror-model'
import { parseLenthValue } from '../utils'

export const font_size: MarkSpec = {
  attrs: {
    size: {},
  },
  parseDOM: [
    {
      style: 'font-size',
      getAttrs(value: string) {
        return { size: parseLenthValue(value) }
      },
    },
  ],
  toDOM(mark) {
    const { size } = mark.attrs
    return ['span', { style: `font-size: ${size}px` }, 0]
  }
}
