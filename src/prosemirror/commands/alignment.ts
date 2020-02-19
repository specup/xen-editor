import { toggleBlockMark, Command } from './base'
import { AlignmentState } from '../schema/marks/mark-alignment'

export const changeAlignment = (align?: AlignmentState): Command => (
  state,
  dispatch,
) => {
  const {
    nodes: { paragraph, heading },
    marks: { alignment },
  } = state.schema

  return toggleBlockMark(
    alignment,
    () => (!align ? undefined : align === 'left' ? false : { align }),
    [paragraph, heading],
  )(state, dispatch)
}
