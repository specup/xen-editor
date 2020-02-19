import { Node } from 'prosemirror-model'
import { Attrs, CSSProperties } from './base'

export const attrs = {
  lineHeight: { default: null },
}

export function getAttrs(dom: HTMLElement): Attrs {
  return {
    lineHeight: dom.style.lineHeight,
  }
}

export function style(node: Node): CSSProperties {
  return {
    'line-height': node.attrs.lineHeight,
  }
}
