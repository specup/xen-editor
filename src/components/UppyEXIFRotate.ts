import { Plugin } from '@uppy/core'
import loadImage from 'blueimp-load-image'

class UppyEXIFRotate extends Plugin {
  constructor(uppy, options) {
    super(uppy, options)
    this.id = options.id || 'EXIFRotate'
    this.type = 'modifier'

    this.prepareUpload = this.prepareUpload.bind(this)
    this.rotate = this.rotate.bind(this)
  }

  rotate(blob) {
    this.uppy.log(`[EXIF Rotate] Image rotate`)
    return new Promise((resolve, reject) => {
      loadImage.parseMetaData(blob, function(data) {
        // default image orientation
        let orientation = 0
        // if exif data available, update orientation
        if (data.exif) {
          orientation = data.exif.get('Orientation')
          loadImage(
            blob,
            canvas => {
              if (canvas.type === 'error') {
                reject(new Error('EXIF file rotate parsing error'))
                return
              }
              canvas.toBlob(newBlob => {
                resolve(newBlob)
              }, 'image/jpeg')
            },
            {
              // should be set to canvas : true to activate auto fix orientation
              canvas: true,
              orientation: orientation,
            },
          )
        } else {
          resolve(blob)
        }
      })
    })
  }

  async prepareUpload(fileIDs) {
    const promises = fileIDs.map(fileID => {
      const file = this.uppy.getFile(fileID)
      if (!file || !file.type || file.type.split('/')[0] !== 'image') {
        return
      }
      return this.rotate(file.data).then(compressedBlob => {
        const compressedFile = Object.assign({}, file, { data: compressedBlob })
        this.uppy.setFileState(fileID, compressedFile)
      })
    })
    await Promise.all(promises)
  }

  install() {
    this.uppy.addPreProcessor(this.prepareUpload)
  }

  uninstall() {
    this.uppy.removePreProcessor(this.prepareUpload)
  }
}

export default UppyEXIFRotate
