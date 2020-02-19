import { keymap } from 'prosemirror-keymap'
import { history } from 'prosemirror-history'
import {
  baseKeymap,
  chainCommands,
  newlineInCode,
  createParagraphNear,
  liftEmptyBlock,
  splitBlockKeepMarks,
} from 'prosemirror-commands'
import { Plugin } from 'prosemirror-state'
import { dropCursor } from 'prosemirror-dropcursor'
import { gapCursor } from 'prosemirror-gapcursor'
import cn from 'classnames'

import { buildKeymap } from './keymap'
import { buildInputRules } from './inputrules'
import select from './select'
import linkify from './linkify'
import placeholder from './placeholder'
import newlinePreserveMarksPlugin from './newline-preserve-marks'

export function setup(options) {
  return [
    buildInputRules(options.schema),
    keymap(buildKeymap(options.schema, options.mapKeys)),
    newlinePreserveMarksPlugin(),
    keymap({
      ...baseKeymap,
      Enter: chainCommands(
        newlineInCode,
        createParagraphNear,
        liftEmptyBlock,
        splitBlockKeepMarks,
      ),
    }),
    dropCursor(),
    gapCursor(),
    linkify,
    placeholder(options.placeholder),
    select,
    history(),
    new Plugin({
      props: {
        attributes: { class: cn('content', options.className) },
      },
    }),
  ]
}
