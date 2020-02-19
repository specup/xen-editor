import React, {
  FunctionComponent,
  useCallback,
  useState,
  useRef,
  FormEvent,
} from 'react'
import styled from 'styled-components'
import {
  useProseMirrorState,
  schema,
  EditorView,
  EditorState,
} from '../../prosemirror'
import { setMark, getMarks, removeMark } from './utils'
import { LinkIcon } from '../icons'
import { MenuButton } from './base'
import Overlay from './Overlay'
import Portal from '../Portal'

function getLinkURL(state: EditorState) {
  const marks = getMarks(state, schema.marks.link)

  if (marks.length === 0) {
    return null
  }

  return marks.reduce((prev, cur) => {
    return prev === cur.attrs.href ? prev : null
  }, marks[0].attrs.href)
}

interface LinkFormProps {
  view: EditorView
  onSubmit: (url: string) => any
}

const LinkForm: FunctionComponent<LinkFormProps> = ({ view, onSubmit }) => {
  const [url, setURL] = useState(() => getLinkURL(view.state) || '')

  const handleChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    setURL(e.currentTarget.value)
  }, [])

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      e.stopPropagation()

      onSubmit(url)
    },
    // eslint-disable-next-line
    [url],
  )

  return (
    <form className="box" onSubmit={handleSubmit}>
      <div className="field">
        <p className="control">
          <Input
            className="input"
            type="text"
            placeholder="URL을 입력하세요"
            value={url}
            onChange={handleChange}
          />
        </p>
      </div>
      <div className="field">
        <p className="control">
          <button className="button is-info" type="submit">
            확인
          </button>
        </p>
      </div>
    </form>
  )
}

const MARGIN = 40

const Input = styled.input`
  min-width: 400px;
`

const removeLinkMark = removeMark(schema.marks.link)

const MenuItemLink: FunctionComponent = () => {
  const [empty, _, view] = useProseMirrorState(state => state.selection.empty)
  const [position, setPosition] = useState<any>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleMenuItemClick = useCallback(() => {
    const overlay = overlayRef.current
    if (!overlay || !overlay.offsetParent) {
      return
    }

    const { state } = view
    const { from, to } = state.selection
    const start = view.coordsAtPos(from)
    const end = view.coordsAtPos(to)
    const box = overlay.offsetParent.getBoundingClientRect()
    const left = Math.max((start.left + end.left) / 2, start.left + 3)
    setPosition({ left: left - box.left, top: start.top - box.top + MARGIN })
  }, [view])

  const handleClose = useCallback(() => {
    setPosition(null)
  }, [])

  const handleSubmit = useCallback(
    (url: string) => {
      if (url) {
        setMark(schema.marks.link, { href: url })(view.state, view.dispatch)
      } else {
        removeLinkMark(view.state, view.dispatch)
      }
      setPosition(null)
    },
    // eslint-disable-next-line
    [],
  )

  return (
    <>
      <MenuButton onClick={handleMenuItemClick} disabled={empty}>
        <LinkIcon />
      </MenuButton>
      <Portal>
        <Overlay
          open={!!position}
          onClose={handleClose}
          style={position}
          ref={overlayRef}
        >
          <LinkForm view={view} onSubmit={handleSubmit} />
        </Overlay>
      </Portal>
    </>
  )
}

export default MenuItemLink
