import React, {
  forwardRef,
  RefForwardingComponent,
  useImperativeHandle,
  useCallback,
  useState,
  useRef,
} from 'react'
import Uppy, { UploadedUppyFile } from '@uppy/core'
import { useProseMirror, schema } from './../../prosemirror'
import { useService } from '../../service'
import { insertNode } from '../../prosemirror/commands'
import FileUploadDialog, { FileUploadDialogAPI } from '../FileUploadDialog'

function createNodeFromFile(file: UploadedUppyFile<{}, {}>) {
  if (!file.type) {
    return null
  }

  if (file.type.startsWith('image/')) {
    return schema.nodes.image.createAndFill({
      // @ts-ignore
      src: file.meta.uploadURL,
    })
  }

  return null
}

export interface MenuItemInsertImageAPI extends FileUploadDialogAPI {
  openDialog: () => any
}

const MenuItemInsertImage: RefForwardingComponent<
  MenuItemInsertImageAPI,
  {}
> = ({}, ref) => {
  const dialogRef = useRef<FileUploadDialogAPI>(null)
  const { applyCommand } = useProseMirror()
  const [open, setOpen] = useState(false)

  useImperativeHandle(
    ref,
    () => {
      return {
        openDialog: () => {
          setOpen(true)
        },
        clickFileInput: () => {
          const api = dialogRef.current
          return api ? api.clickFileInput() : false
        },
      }
    },
    [],
  )

  const handleOpen = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleComplete = useCallback(
    (result: Uppy.UploadResult) => {
      result.successful.map(file => {
        const node = createNodeFromFile(file)
        if (!node) {
          return
        }
        applyCommand(insertNode(node))
      })
    },
    [applyCommand],
  )

  const service = useService()

  return (
    <FileUploadDialog
      open={open}
      onRequestClose={handleClose}
      onComplete={handleComplete}
      onFileAdded={handleOpen}
      {...service}
      ref={dialogRef}
    />
  )
}

export default forwardRef(MenuItemInsertImage)
