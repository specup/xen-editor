import { Node } from 'prosemirror-model'
import { Attrs, CSSProperties } from './base'
import { parseLenthValue } from '../utils'

export const attrs = {
  indentation: { default: null },
}

export function getAttrs(dom: HTMLElement): Attrs {
  return {
    indentation: parseLenthValue(dom.style.marginLeft),
  }
}

export function style(node: Node): CSSProperties {
  const { indentation } = node.attrs
  return {
    'margin-left': indentation && `${indentation}px`,
  }
}
