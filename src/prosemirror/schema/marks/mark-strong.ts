import { MarkSpec, DOMOutputSpec } from 'prosemirror-model'

const strongDOM: DOMOutputSpec = ['strong', 0]

export const strong: MarkSpec = {
  parseDOM: [
    { tag: 'strong' },
    {
      tag: 'b',

      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      getAttrs: (node: HTMLElement) => node.style.fontWeight != 'normal' && null,
    },
    {
      style: 'font-weight',
      getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
    },
  ],
  toDOM() {
    return strongDOM
  },
}
