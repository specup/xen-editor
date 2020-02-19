import { NodeSpec } from 'prosemirror-model'
import OrderedMap from 'orderedmap'

import { blockquote } from './node-blockquote'
import { code_block } from './node-code_block'
import { doc } from './node-doc'
import { hard_break } from './node-hard_break'
import { heading } from './node-heading'
import { horizontal_rule } from './node-horizontal_rule'
import { iframe } from './node-iframe'
import { image } from './node-image'
import { paragraph } from './node-paragraph'
import { text } from './node-text'
import table from './node-tables'

export { Attrs } from './base'

export type NodeName =
  | 'doc'
  | 'paragraph'
  | 'blockquote'
  | 'code_block'
  | 'hard_break'
  | 'heading'
  | 'horizontal_rule'
  | 'iframe'
  | 'image'
  | 'text'
  | 'table'
  | 'table_row'
  | 'table_cell'
  | 'table_header'
  | 'table_colgroup'
  | 'table_col'
  | 'table_body'

export const nodes = OrderedMap.from<NodeSpec>({
  doc,
})
  // paragraph must be first block node
  .append({
    paragraph,
  })
  .append({
    blockquote,
    code_block,
    hard_break,
    heading,
    horizontal_rule,
    iframe,
    image,
    text,
    table: table.table,
    table_row: table.table_row,
    table_cell: table.table_cell,
    table_header: table.table_header,
    table_colgroup: table.table_colgroup,
    table_col: table.table_col,
    table_body: table.table_body,
  })
