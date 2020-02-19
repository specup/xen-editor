import React, {
  forwardRef,
  RefForwardingComponent,
  useRef,
  useCallback,
  useImperativeHandle,
} from 'react'
import isMobile from 'ismobilejs'

import {
  ProseMirror,
  ProseMirrorInstance,
  EditorView,
  Ref,
  createAPI,
  EditorAPI,
} from '../prosemirror'
import { ServiceContext } from '../service'
import { FileUploadUtils } from './FileUploadDialog'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'

export { EditorAPI }

export interface EditorProps extends FileUploadUtils {
  className?: string
  editorClassName?: string
  desktopMenuClassName?: string
  initialValue?: string
  placeholder?: string
  onChange?: (view: EditorView) => void
}

const Editor: RefForwardingComponent<EditorAPI, EditorProps> = (
  {
    className,
    editorClassName,
    desktopMenuClassName,
    initialValue,
    placeholder,
    onChange,
    ...other
  },
  ref,
) => {
  const proseMirrorRef = useRef<ProseMirrorInstance>(null)

  useImperativeHandle(
    ref,
    () => createAPI(proseMirrorRef.current),
    [],
  )

  const render = useCallback(
    (ref: Ref) => {
      const element = <div ref={ref} />
      return isMobile.any ? (
        <MobileLayout className={className}>{element}</MobileLayout>
      ) : (
        <DesktopLayout
          className={className}
          menuClassName={desktopMenuClassName}
        >
          {element}
        </DesktopLayout>
      )
    },
    [className, desktopMenuClassName],
  )

  return (
    <ServiceContext.Provider value={other}>
      <ProseMirror
        onChange={onChange}
        className={editorClassName}
        initialValue={initialValue}
        placeholder={placeholder || ''}
        ref={proseMirrorRef}
      >
        {render}
      </ProseMirror>
    </ServiceContext.Provider>
  )
}

export default forwardRef(Editor)
