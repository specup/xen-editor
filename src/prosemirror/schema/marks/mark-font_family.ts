import { MarkSpec, DOMOutputSpec } from 'prosemirror-model'

const spanDOM: DOMOutputSpec = ['span', 0]

enum FontFamily {
  Dotum = 'Dotum',
  Gulim = 'Gulim',
  Batang = 'Batang',
  Gungsuh = 'Gungsuh',
  NanumGothic = 'NanumGothic',
  NanumMyeongjo = 'NanumMyeongjo',
}

const Aliases = {
  [FontFamily.Dotum]: ['돋움'],
  [FontFamily.Gulim]: ['굴림'],
  [FontFamily.Batang]: ['바탕', 'AppleMyungjo'],
  [FontFamily.Gungsuh]: ['궁서', 'Gungsuh', 'GungSeo'],
  [FontFamily.NanumGothic]: ['나눔고딕', 'NanumGothic', '돋움'],
  [FontFamily.NanumMyeongjo]: ['나눔명조', 'NanumMyeongjo', '돋움'],
}

const index: Record<string, FontFamily> = {}

Object.keys(Aliases).map((key: FontFamily) => {
  const aliases = Aliases[key]
  for (const alias of [key, ...aliases]) {
    if (!index[alias]) {
      index[alias] = key
    }
  }
})

function parseValue(value: string): FontFamily {
  const tokens = value.split(',').map(token => token.trim())
  for (const token of tokens) {
    const family = index[token]
    if (family) {
      return family
    }
  }
  return FontFamily.Dotum // default value
}

function toCSS(value: FontFamily) {
  const aliases = Aliases[value]
  return aliases ? aliases.join(', ') : null
}

export const font_family: MarkSpec = {
  attrs: {
    family: {},
  },
  parseDOM: [
    {
      style: 'font-family',
      getAttrs(value: string) {
        return { family: parseValue(value) }
      },
    },
  ],
  toDOM(mark) {
    const { family } = mark.attrs
    const css = toCSS(family)
    return css ? ['span', { style: `font-family: ${css}` }, 0] : spanDOM
  }
}
