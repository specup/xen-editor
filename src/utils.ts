import { EditorState } from './prosemirror'

export interface AssetInfo {
  containsYoutube: boolean
  containsImage: boolean
  imageSrc?: string
  youtubeSrc?: string
}

export function getAssetInfo(state: EditorState): AssetInfo {
  let containsYoutube = false
  let containsImage = false
  let imageSrc
  let youtubeSrc

  state.doc.descendants((child, pos) => {
    switch (child.type.name) {
      case 'iframe': {
        if (
          child.attrs.src &&
          child.attrs.src.startsWith('https://www.youtube.com/embed/')
        ) {
          containsYoutube = true
          youtubeSrc = `${child.attrs.src.replace(
            'https://www.youtube.com/embed/',
            'https://img.youtube.com/vi/',
          )}/0.jpg`
        }
        break
      }
      case 'image': {
        containsImage = true
        imageSrc = child.attrs.src
        break
      }
    }
  })

  return {
    containsYoutube,
    containsImage,
    imageSrc,
    youtubeSrc,
  }
}
