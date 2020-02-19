export type Attrs = { [key: string]: any }

export type CSSProperties = { [key: string]: number | string }

type Mapper<T, U> = (input: T) => U

export function combine<T, U extends object>(...mappers: Mapper<T, U>[]) {
  const [first, ...other] = mappers
  return (input: T) => {
    const result = first(input)
    for (const mapper of other) {
      Object.assign(result, mapper(input))
    }
    return result
  }
}

function stringifyCSS(object: any) {
  return Object.keys(object)
    .filter(key => object[key] || object[key] === 0)
    .map(key => `${key}: ${object[key]};`)
    .join('')
}

export function createStyle<T, U extends object>(...mappers: Mapper<T, U>[]) {
  const mapper = combine(...mappers)
  return (input: T): Record<string, string> => {
    const style = stringifyCSS(mapper(input))
    return style ? { style, class: 'block' } : { class: 'block' }
  }
}
