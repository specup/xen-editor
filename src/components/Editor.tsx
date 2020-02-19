import React, {
  forwardRef,
  RefForwardingComponent,
  useRef,
  useCallback,
  useImperativeHandle,
} from 'react'
import { DOMSerializer } from 'prosemirror-model'
import isMobile from 'ismobilejs'

import {
  ProseMirror,
  ProseMirrorInstance,
  EditorView,
  Ref,
  Fragment,
  schema,
} from '../prosemirror'
import { ServiceContext } from '../service'
import { FileUploadUtils } from './FileUploadDialog'
import DesktopLayout from './DesktopLayout'
import MobileLayout from './MobileLayout'

export interface EditorAPI {
  view(): EditorView | null
  html(): string | null
  dom(): DocumentFragment | null
  isEmpty(): boolean
  isDirty(): boolean
}

export interface EditorProps extends FileUploadUtils {
  className?: string
  editorClassName?: string
  desktopMenuClassName?: string
  initialValue?: string
  placeholder?: string
  onChange?: (view: EditorView) => void
}

function fragmentToDOM(fragment: Fragment) {
  const serializer = DOMSerializer.fromSchema(schema)
  return serializer.serializeFragment(fragment)
}

function domToString(dom: DocumentFragment) {
  const div = document.createElement('div')
  div.appendChild(dom)

  return div.innerHTML
}

function getDOM(view: EditorView) {
  return fragmentToDOM(view.state.doc.content)
}

function getHTML(view: EditorView) {
  const dom = fragmentToDOM(view.state.doc.content)
  return domToString(dom)
}

function isViewEmpty(view: EditorView) {
  const { childCount } = view.state.doc
  if (childCount === 0) {
    return true
  }

  if (childCount > 1) {
    return false
  }

  const { firstChild } = view.state.doc

  if (!firstChild) {
    return true
  }

  if (firstChild.type.name !== 'paragraph' || firstChild.childCount > 0) {
    return false
  }

  return true
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
    () => ({
      view() {
        return proseMirrorRef.current && proseMirrorRef.current.view
      },
      dom() {
        const view = proseMirrorRef.current && proseMirrorRef.current.view
        return view && getDOM(view)
      },
      html() {
        const view = proseMirrorRef.current && proseMirrorRef.current.view
        return view && getHTML(view)
      },
      isEmpty() {
        const view = proseMirrorRef.current && proseMirrorRef.current.view
        return view ? isViewEmpty(view) : true
      },
      isDirty() {
        if (!proseMirrorRef.current) {
          return false
        }
        const { view, initialState } = proseMirrorRef.current
        return view.state !== initialState
      },
    }),
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
