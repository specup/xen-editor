import { MarkSpec } from 'prosemirror-model'

export const link: MarkSpec = {
  attrs: {
    href: {},
    title: { default: null },
  },
  inclusive: false,
  parseDOM: [
    {
      tag: 'a[href]',
      getAttrs(dom: Element) {
        return {
          href: dom.getAttribute('href'),
          title: dom.getAttribute('title'),
        }
      },
    },
  ],
  toDOM(node) {
    const { href, title } = node.attrs
    return ['a', { href, title }, 0]
  }
}
