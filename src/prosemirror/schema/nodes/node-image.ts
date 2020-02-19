import { NodeSpec } from 'prosemirror-model'

export const image: NodeSpec = {
  inline: true,
  attrs: {
    src: {},
    alt: { default: null },
    title: { default: null },
    width: { default: null },
  },
  group: 'inline',
  draggable: true,
  parseDOM: [
    {
      tag: 'img[src]',
      getAttrs(dom: HTMLElement) {
        return {
          width: dom.style.width,
          src: dom.getAttribute('src'),
          title: dom.getAttribute('title'),
          alt: dom.getAttribute('alt'),
        }
      },
    },
  ],
  toDOM(node) {
    const { src, alt, title, width } = node.attrs
    return ['img', { src, alt, title, style: width ? `width:${width}` : '' }]
  },
}
