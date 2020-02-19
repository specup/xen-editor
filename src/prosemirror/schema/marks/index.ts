import { MarkSpec } from 'prosemirror-model'

import { background_color } from './mark-background_color'
import { code } from './mark-code'
import { em } from './mark-em'
import { font_color } from './mark-font_color'
import { font_family } from './mark-font_family'
import { font_size } from './mark-font_size'
import { link } from './mark-link'
import { s } from './mark-s'
import { strong } from './mark-strong'
import { u } from './mark-underline'
import { alignment } from './mark-alignment'

export type MarkName =
  | 'link'
  | 'code'
  | 'em'
  | 's'
  | 'strong'
  | 'u'
  | 'font_size'
  | 'font_color'
  | 'font_family'
  | 'background_color'
  | 'alignment'

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const marks: { [name in MarkName]: MarkSpec } = {
  link,
  code,
  em,
  s,
  strong,
  u,
  font_size,
  font_color,
  font_family,
  background_color,
  alignment,
}
