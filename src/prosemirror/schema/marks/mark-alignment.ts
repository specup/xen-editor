// https://bitbucket.org/atlassian/atlaskit-mk-2/src/bc5426962e3d6751f0e23450fadf81d631cd74b6/packages/editor/adf-schema/src/schema/marks/alignment.ts
import { MarkSpec } from 'prosemirror-model'
import { ALIGNMENT } from '../groups'

export type AlignmentState = 'left' | 'center' | 'right' | 'justify'

export interface AlignmentAttributes {
  align: 'left' | 'center' | 'right' | 'justify'
}

export interface AlignmentMarkDefinition {
  type: 'alignment'
  attrs: AlignmentAttributes
}

export const alignment: MarkSpec = {
  excludes: `alignment`,
  group: ALIGNMENT,
  attrs: {
    align: {},
  },
  parseDOM: [
    {
      tag: 'div.editor-block-mark',
      getAttrs: dom => {
        const align = (dom as Element).getAttribute('data-align')
        return align ? { align } : false
      },
    },
    {
      style: 'text-align',
      getAttrs: value => {
        if (/(left|center|right|justify)/.test(value as string)) {
          return {
            align: value,
          }
        }
        return false
      },
    },
  ],
  toDOM(mark) {
    return [
      'div',
      {
        class: `editor-block-mark editor-align-${mark.attrs.align}`,
        'data-align': mark.attrs.align,
      },
      0,
    ]
  },
}
