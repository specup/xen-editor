export function parseLenthValue(css: string | null) {
  if (!css) {
    return null
  }

  if (css.endsWith('px')) {
    const str = css.substr(0, css.length - 2)
    const num = parseFloat(str)
    return isNaN(num) ? null : num
  }

  return null
}
