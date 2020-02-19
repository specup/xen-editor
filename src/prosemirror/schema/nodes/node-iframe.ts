import { NodeSpec } from 'prosemirror-model'

function getElementAttrs(dom: Element) {
  const attrs = {};

  if (dom.attributes.length) {
    for (let i = 0; i < dom.attributes.length; i++) {
      const attr = dom.attributes[i]
      if (attr.value !== undefined) {
        attrs[attr.name] = attr.value;
      }
    }
  }

  return attrs;
}

export const iframe: NodeSpec = {
  group: 'inline', // Allow this node to be child of paragraph
  inline: true,
  attrs: {
    height: { default: null },
    width: { default: null },
    scrolling: { default: null },
    frameborder: { default: '0' },
    allow: { default: null },
    allowfullscreen: { default: null },
    name: { default: null },
    referrerpolicy: { default: null },
    sandbox: { default: null },
    src: { default: null },
    srcdoc: { default: null },

    // TODO: check if this is really needed
    style: { default: null },
  },
  parseDOM: [
    {
      tag: 'iframe',
      getAttrs(dom: Element) {
        return getElementAttrs(dom)
      },
    },
  ],
  toDOM(node) {
    return ['iframe', node.attrs]
  },
}
