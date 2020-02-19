/* eslint-disable no-new */
import { Plugin } from '@uppy/core'
import Compressor from 'compressorjs'

type UppyCompressorOptions = {
  id?: string
} & Compressor.Options

class UppyCompressor extends Plugin {
  options: UppyCompressorOptions

  constructor(uppy, options: UppyCompressorOptions) {
    super(uppy, options)
    this.id = options.id || 'Compressor'
    this.type = 'modifier'
    this.options = options

    this.prepareUpload = this.prepareUpload.bind(this)
    this.compress = this.compress.bind(this)
  }

  compress(blob) {
    this.uppy.log(`[Compressor] Image size before compression: ${blob.size}`)
    return new Promise((resolve, reject) => {
      new Compressor(
        blob,
        Object.assign({}, this.options, {
          success: result => {
            this.uppy.log(
              `[Compressor] Image size after compression: ${result.size}`,
            )
            return resolve(result)
          },
          error: err => {
            return reject(err)
          },
        }),
      )
    })
  }

  async prepareUpload(fileIDs) {
    const promises = fileIDs.map(fileID => {
      const file = this.uppy.getFile(fileID)
      if (!file.type) return
      if (file.type.split('/')[0] !== 'image') {
        return
      }
      return this.compress(file.data).then(compressedBlob => {
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

export default UppyCompressor
