import { createProseMirror } from '../prosemirror'
import { getAssetInfo, AssetInfo } from '../utils'

 describe('getAssetInfo', () => {
  function getAssetInfoFromHTML(html: string) {
    const proseMirror = createProseMirror({
      initialValue: html,
    })

     const assetInfo = getAssetInfo(proseMirror.view.state)
    return assetInfo
  }

   it('returns editor asset info', () => {
    expect(getAssetInfoFromHTML(`
      <p>start</p>
      <iframe src="https://www.youtube.com/embed/123"></iframe>
      <p>end</p>
    `)).toEqual({
      containsYoutube: true,
      containsImage: false,
    })

     expect(getAssetInfoFromHTML(`
      <p>start</p>
      <iframe src="https://www.youtube.com/embed/123"></iframe>
      <p>end</p>
    `)).toEqual({
      containsYoutube: true,
      containsImage: false,
    })

     expect(getAssetInfoFromHTML(`
      <p>start</p>
      <p>
        <iframe src="https://www.youtube.com/embed/123"></iframe>
      </p>
      <p>end</p>
    `)).toEqual({
      containsYoutube: true,
      containsImage: false,
    })

     expect(getAssetInfoFromHTML(`
      <p>start</p>
      <img src="https://www.example.org/my-image.jpg">
      <p>end</p>
    `)).toEqual({
      containsYoutube: false,
      containsImage: true,
    })

     expect(getAssetInfoFromHTML(`
      <p>start</p>
      <p>
        <img src="https://www.example.org/my-image.jpg">
      </p>
      <p>end</p>
    `)).toEqual({
      containsYoutube: false,
      containsImage: true,
    })

     expect(getAssetInfoFromHTML(`
      <p>start</p>
      <iframe src="https://www.youtube.com/embed/123"></iframe>
      <img src="https://www.example.org/my-image.jpg">
      <p>end</p>
    `)).toEqual({
      containsYoutube: true,
      containsImage: true,
    })

     expect(getAssetInfoFromHTML(`
      <p>start</p>
      <p>
        <iframe src="https://www.youtube.com/embed/123"></iframe>
        <img src="https://www.example.org/my-image.jpg">
      </p>
      <p>end</p>
    `)).toEqual({
      containsYoutube: true,
      containsImage: true,
    })
  })
})
