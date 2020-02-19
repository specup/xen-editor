import React, {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useCallback,
  useContext,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { DOMParser } from 'prosemirror-model'
import {
  Plugin as BasePlugin,
  EditorState as BaseEditorState,
  Transaction as BaseTransaction,
} from 'prosemirror-state'

import {
  EditorView as BaseEditorView,
  DirectEditorProps,
} from 'prosemirror-view'

import schema, { Schema } from './schema'
import { Command } from './commands'
import { setup } from './plugins'

export type EditorView = BaseEditorView<Schema>
export type EditorState = BaseEditorState<Schema>
export type Transaction = BaseTransaction<Schema>
export type Dispatch = (tr: Transaction) => void

export type ApplyCommand = (command: Command) => any

export interface ProseMirrorInstance {
  view: EditorView
  initialState: EditorState
  subscribe: (callback: () => any) => () => any
  applyCommand: ApplyCommand
}

interface CreateProseMirrorOptions {
  initialValue?: string
  className?: string
  placeholder?: string
  directEditorProps?: Omit<DirectEditorProps<Schema>, 'state'>
}

export function createProseMirror({
  initialValue,
  className,
  placeholder,
  directEditorProps = {},
}: CreateProseMirrorOptions): ProseMirrorInstance {
  const callbacks: Array<() => any> = []

  const el = document.createElement('div')
  el.innerHTML = initialValue || ''

  const view = new BaseEditorView(undefined, {
    ...directEditorProps,
    state: BaseEditorState.create({
      doc: DOMParser.fromSchema(schema).parse(el),
      plugins: [
        ...setup({ schema, className, placeholder }),
        new BasePlugin({
          view: () => ({
            update: () => {
              for (const callback of callbacks) {
                callback()
              }
            },
          }),
        }),
      ],
    }),
  })

  function subscribe(callback: () => any) {
    callbacks.push(callback)
    return () => {
      const index = callbacks.indexOf(callback)
      if (index >= 0) {
        callbacks.splice(index, 1)
      }
    }
  }

  function applyCommand(command: Command) {
    command(view.state, view.dispatch, view)
  }

  return { view, initialState: view.state, subscribe, applyCommand }
}

const ProseMirrorContext = createContext<ProseMirrorInstance | null>(null)

export type Ref = (dom: HTMLElement | null) => any

interface ProseMirrorProps {
  className?: string
  initialValue?: string
  placeholder?: string
  children: (ref: Ref) => ReactNode
  onChange?: (editorView: EditorView) => void
}

export const ProseMirror = forwardRef<
  ProseMirrorInstance | null,
  ProseMirrorProps
>((props, ref) => {
  const { className, initialValue, children, placeholder, onChange } = props
  const [instance, setInstance] = useState<ProseMirrorInstance | null>(null)

  useImperativeHandle(ref, () => instance, [instance])

  useEffect(() => {
    const proseMirror = createProseMirror({
      className,
      initialValue,
      placeholder,
      directEditorProps: {
        dispatchTransaction: transaction => {
          const editorState = proseMirror.view.state.apply(transaction)
          proseMirror.view.updateState(editorState)

          if (onChange && transaction.docChanged) {
            onChange(proseMirror.view)
          }
        },
      },
    })
    setInstance(proseMirror)

    return () => {
      setInstance(null)
      proseMirror.view.destroy()
    }
  }, [className, initialValue, onChange, placeholder])

  const handleRef = useCallback(
    (dom: HTMLDivElement | null) => {
      if (!dom || !instance) {
        return
      }
      dom.appendChild(instance.view.dom)
    },
    [instance],
  )

  if (!instance) {
    return null
  }

  return (
    <ProseMirrorContext.Provider value={instance}>
      {children(handleRef)}
    </ProseMirrorContext.Provider>
  )
})

ProseMirror.displayName = 'ProseMirror'

export function useProseMirror() {
  const proseMirror = useContext(ProseMirrorContext)
  if (!proseMirror) {
    throw new Error('Cannot find ProseMirror instance')
  }

  return proseMirror
}

export function useProseMirrorState<T>(
  mapState: (state: EditorState, view: EditorView) => T,
): [T, ApplyCommand, EditorView] {
  const { applyCommand, view, subscribe } = useProseMirror()
  const [value, setValue] = useState(() => {
    return mapState(view.state, view)
  })

  useEffect(() => {
    return subscribe(() => {
      const nextValue = mapState(view.state, view)
      setValue(nextValue)
    })
  }, [view, subscribe, mapState])

  return [value, applyCommand, view]
}
