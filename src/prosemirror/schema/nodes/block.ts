import { combine, createStyle } from './base'
import * as indentation from './attr-indentation'
import * as lineHeight from './attr-lineHeight'

export const attrs = {
  ...indentation.attrs,
  ...lineHeight.attrs,
}

export const getAttrs = combine(indentation.getAttrs, lineHeight.getAttrs)

export const style = createStyle(indentation.style, lineHeight.style)
