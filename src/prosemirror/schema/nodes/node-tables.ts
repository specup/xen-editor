// https://github.com/ProseMirror/prosemirror-tables/blob/master/src/schema.js
import { NodeSpec } from 'prosemirror-model'
import { CellAttributes } from 'prosemirror-tables'
import kebabCase from 'lodash/kebabCase'

function getCellAttrs(dom, extraAttrs) {
  const widthAttr = dom.getAttribute('data-colwidth')
  const widths =
    widthAttr && /^\d+(,\d+)*$/.test(widthAttr)
      ? widthAttr.split(',').map(s => Number(s))
      : null
  const colspan = Number(dom.getAttribute('colspan') || 1)
  const result = {
    colspan,
    rowspan: Number(dom.getAttribute('rowspan') || 1),
    colwidth: widths && widths.length === colspan ? widths : null,
  }
  for (const prop in extraAttrs) {
    const getter = extraAttrs[prop].getFromDOM
    const value = getter && getter(dom)
    if (value != null) result[prop] = value
  }
  return result
}

function setCellAttrs(node, extraAttrs) {
  const attrs: any = {}
  if (node.attrs.colspan !== 1) attrs.colspan = node.attrs.colspan
  if (node.attrs.rowspan !== 1) attrs.rowspan = node.attrs.rowspan

  try {
    if (node.attrs.colwidth)
      attrs['data-colwidth'] = node.attrs.colwidth.join(',')
  } catch (error) {}

  for (const prop in extraAttrs) {
    const setter = extraAttrs[prop].setDOMAttr
    if (setter) setter(node.attrs[prop], attrs)
  }
  return attrs
}
export interface TableNodes {
  table: NodeSpec
  table_row: NodeSpec
  table_cell: NodeSpec
  table_header: NodeSpec
  table_body: NodeSpec
  table_colgroup: NodeSpec
  table_col: NodeSpec
}

export function tableNodes(options): TableNodes {
  const extraAttrs = options.cellAttributes || {}
  const cellAttrs = {
    colspan: { default: 1 },
    rowspan: { default: 1 },
    colwidth: { default: null },
  }
  for (const prop in extraAttrs)
    cellAttrs[prop] = { default: extraAttrs[prop].default }

  return {
    table: {
      content: '(table_body | table_colgroup)+',
      tableRole: 'table',
      isolating: true,
      group: options.tableGroup,
      parseDOM: [{ tag: 'table' }],
      toDOM() {
        return ['table', 0]
      },
    },
    table_body: {
      content: 'table_row+',
      group: options.tableGroup,
      parseDOM: [{ tag: 'tbody' }],
      toDOM() {
        return ['tbody', 0]
      },
    },
    table_row: {
      content: '(table_cell | table_header)*',
      tableRole: 'row',
      parseDOM: [{ tag: 'tr' }],
      toDOM() {
        return ['tr', 0]
      },
    },
    table_cell: {
      content: options.cellContent,
      attrs: cellAttrs,
      tableRole: 'cell',
      isolating: true,
      parseDOM: [{ tag: 'td', getAttrs: dom => getCellAttrs(dom, extraAttrs) }],
      toDOM(node) {
        return ['td', setCellAttrs(node, extraAttrs), 0]
      },
    },
    table_header: {
      content: options.cellContent,
      attrs: cellAttrs,
      tableRole: 'header_cell',
      isolating: true,
      parseDOM: [{ tag: 'th', getAttrs: dom => getCellAttrs(dom, extraAttrs) }],
      toDOM(node) {
        return ['th', setCellAttrs(node, extraAttrs), 0]
      },
    },
    table_colgroup: {
      content: 'table_col*',
      attrs: cellAttrs,
      parseDOM: [
        { tag: 'colgroup', getAttrs: dom => getCellAttrs(dom, extraAttrs) },
      ],
      toDOM(node) {
        return ['colgroup', setCellAttrs(node, extraAttrs), 0]
      },
    },
    table_col: {
      attrs: {
        width: { default: null },
      },
      parseDOM: [
        {
          tag: 'col',
          getAttrs: (dom: HTMLTableColElement) => {
            const width = dom.getAttribute('width')
            return {
              width,
            }
          },
        },
      ],
      toDOM(node) {
        return [
          'col',
          {
            style: node.attrs.width ? `width: ${node.attrs.width}px;` : '',
            width: node.attrs.width,
          },
        ]
      },
    },
  }
}

export function tableNodeTypes(schema) {
  let result = schema.cached.tableNodeTypes
  if (!result) {
    result = schema.cached.tableNodeTypes = {}
    for (const name in schema.nodes) {
      const type = schema.nodes[name]
      const role = type.spec.tableRole
      if (role) result[role] = type
    }
  }
  return result
}

function genCellStyleAttributes(styleNames: Array<keyof CSSStyleDeclaration>) {
  const cellAttributes: { [key: string]: CellAttributes } = {}
  for (const styleName of styleNames) {
    const styleNameKabab = kebabCase(styleName as string)
    cellAttributes[styleName] = {
      default: null,
      getFromDOM(dom: HTMLElement) {
        return dom.style[styleName] || null
      },
      setDOMAttr(value, attrs) {
        if (value) {
          attrs.style = (attrs.style || '') + `${styleNameKabab}: ${value};`
        }
      },
    }
  }
  return cellAttributes
}

export default tableNodes({
  tableGroup: 'block',
  cellContent: 'block+',
  cellAttributes: {
    ...genCellStyleAttributes([
      'backgroundColor',
      'verticalAlign',
      'textAlign',
      'borderBottom',
      'borderTop',
      'borderRight',
      'borderLeft',
      'border',
    ]),

    // import get from 'lodash/get'
    // colwidth: {
    //   default: null,
    //   getFromDOM(dom: HTMLTableCellElement) {
    //     if (dom.hasAttribute('data-colwidth')) {
    //       return dom.getAttribute('data-colwidth')
    //     }
    //     const tableEl = dom.closest('table')
    //     if (tableEl) {
    //       const colElement: HTMLTableColElement = get(
    //         tableEl.querySelectorAll('col'),
    //         `[${dom.cellIndex}]`,
    //       )

    //       if (colElement) {
    //         if (colElement.hasAttribute('width')) {
    //           return colElement.getAttribute('width')
    //         }
    //       }
    //     }
    //     return null
    //   },
    //   setDOMAttr(value, attrs) {
    //     if (value) {
    //       attrs['data-colwidth'] = value
    //     }
    //   },
    // },
  },
})
