import { MarkSpec } from 'prosemirror-model'

export const font_color: MarkSpec = {
  attrs: {
    color: {},
  },
  parseDOM: [
    {
      style: 'color',
      getAttrs(value) {
        return { color: value }
      },
    },
  ],
  toDOM(mark) {
    const { color } = mark.attrs
    return ['span', { style: `color: ${color}` }, 0]
  }
}
