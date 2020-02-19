import { Schema as BaseSchema } from 'prosemirror-model'

export { Attrs } from './nodes'

import { nodes, NodeName } from './nodes'
import { marks, MarkName } from './marks'

const schema = new BaseSchema<NodeName, MarkName>({ nodes, marks })
export default schema

export type Schema = typeof schema
