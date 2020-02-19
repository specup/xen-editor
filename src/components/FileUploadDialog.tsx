import React, {
  forwardRef,
  RefForwardingComponent,
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
} from 'react'
import Uppy from '@uppy/core'
import { DashboardModal } from '@uppy/react'
import S3 from '@uppy/aws-s3'
import Portal from './Portal'
import UppyEXIFRotate from './UppyEXIFRotate'
import UppyCompressor from './UppyCompressor'

const untypedDashboardModalProps: {} = {
  closeAfterFinish: true,
}

export interface UploadURL {
  putURL: string
  getURL: string
  meta: any
}

export interface FileUploadUtils {
  createUploadURL: (
    name: string,
    size: number,
    type: string,
  ) => Promise<UploadURL>
  completeUpload?: (meta: any[]) => Promise<any>
  totalFileSizeLimit?: number
  maxNumberOfFiles?: number
}

export interface FileUploadDialogProps extends FileUploadUtils {
  open: boolean
  onRequestClose: () => any
  onComplete: (result: Uppy.UploadResult) => any
  onFileAdded?: () => any
  allowedFileTypes?: string[]
}

const CONVERT_SIZE_MAXIMUM = 10 * 1000 * 1000

export interface FileUploadDialogAPI {
  clickFileInput: () => boolean
}

function findInputElement(dom: HTMLDivElement) {
  if (!dom) {
    return null
  }
  const inputs = dom.getElementsByClassName('uppy-Dashboard-input')
  if (inputs.length === 0) {
    return null
  }
  return inputs[0] as HTMLInputElement
}

const FileUploadDialog: RefForwardingComponent<
  FileUploadDialogAPI,
  FileUploadDialogProps
> = (
  {
    allowedFileTypes = ['image/*'],
    open,
    onRequestClose,
    onComplete,
    onFileAdded,
    createUploadURL,
    completeUpload,
    totalFileSizeLimit,
    maxNumberOfFiles,
  },
  ref,
) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const rootRef = useCallback(dom => {
    inputRef.current = findInputElement(dom)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      clickFileInput: () => {
        if (!inputRef.current) {
          return false
        }
        inputRef.current.click()
        return true
      },
    }),
    [],
  )

  const [currentUppy, setCurrentUppy] = useState<Uppy.Uppy | null>(null)

  const uppyRef = useRef<Uppy.Uppy | null>(null)

  useEffect(() => {
    const uppy = (uppyRef.current = Uppy({
      meta: { type: 'avatar' },
      autoProceed: true,
      restrictions: {
        maxFileSize: null,
        maxNumberOfFiles: maxNumberOfFiles || null,
        minNumberOfFiles: null,
        allowedFileTypes,
      },
      locale: {
        strings: {
          browse: '내 기기에서 찾아보세요',
          dropHereOr: '여기에 파일을 끌어 놓거나 %{browse}',
          dropPaste: '여기에 파일을 끌어 놓거나, 붙여넣거나 %{browse}',
          uploading: '업로드 중',
        },
      },
      onBeforeFileAdded: (currentFile, files) => {
        if (!totalFileSizeLimit) {
          return true
        }

        const totalFileSize = Object.keys(files).reduce((prev, filename) => {
          const file = files[filename]
          return prev + file.size
        }, 0)

        const grandTotalFileSize = currentFile.data.size + totalFileSize

        if (grandTotalFileSize >= totalFileSizeLimit) {
          uppy.info('파일 업로드 최대 용량을 초과했습니다.', 'error', 3000)
          return false
        }

        return true
      },
    })
      .use(UppyEXIFRotate, {})
      .use(UppyCompressor, { quality: 0.7, convertSize: CONVERT_SIZE_MAXIMUM })
      .use(S3, {
        async getUploadParameters(file) {
          const { getURL, putURL, meta } = await createUploadURL(
            file.name,
            file.size,
            file.type || '',
          )
          file.meta['uploadURL'] = getURL
          file.meta['uploadMeta'] = meta

          // Return an object in the correct shape.
          return {
            method: 'PUT',
            url: putURL,
            fields: {},
          }
        },
      })
      .on('complete', async result => {
        uppy.reset()
        if (completeUpload) {
          await completeUpload(
            result.successful.map(file => file.meta['uploadMeta']),
          )
        }
        onComplete(result)
      }))

    setCurrentUppy(uppy)

    return () => {
      uppy.close()
    }
  }, [totalFileSizeLimit])

  useEffect(() => {
    const uppy = uppyRef.current
    if (!uppy || !onFileAdded) {
      return
    }

    uppy.on('file-added', onFileAdded)
    return () => {
      uppy.off('file-added', onFileAdded)
    }
  }, [onFileAdded])

  if (!currentUppy) {
    return null
  }

  return (
    <Portal>
      <div style={{ position: 'absolute' }} ref={rootRef}>
        <DashboardModal
          uppy={currentUppy}
          open={open}
          onRequestClose={onRequestClose}
          disablePageScrollWhenModalOpen={false}
          proudlyDisplayPoweredByUppy={false}
          {...untypedDashboardModalProps}
        />
      </div>
    </Portal>
  )
}

export default forwardRef(FileUploadDialog)
