import { MarkSpec } from 'prosemirror-model'

export const background_color: MarkSpec = {
  attrs: {
    color: {},
  },
  parseDOM: [
    {
      style: 'background-color',
      getAttrs(value) {
        return { color: value }
      },
    },
  ],
  toDOM(mark) {
    const { color } = mark.attrs
    return ['span', { style: `background-color: ${color}` }, 0]
  }
}
