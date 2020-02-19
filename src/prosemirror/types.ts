import {
  NodeType as BaseNodeType,
  MarkType as BaseMarkType,
  Node as BaseNode,
  Mark as BaseMark,
  Fragment as BaseFragment,
} from 'prosemirror-model'
import { Schema } from './schema'

export type NodeType = BaseNodeType<Schema>

export type MarkType = BaseMarkType<Schema>

export type Node = BaseNode<Schema>

export type Mark = BaseMark<Schema>

export type Fragment = BaseFragment<Schema>
