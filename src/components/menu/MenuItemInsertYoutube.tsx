import React, {
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
  FormEvent,
} from 'react'
import parseURL from 'url-parse'
import { useProseMirror, schema } from './../../prosemirror'
import { Modal, ModalHeader, ModalBody, ModalFooter } from '../modal'
import { insertNode } from '../../prosemirror/commands'
import Portal from '../Portal'

interface YoutubeDialogProps {
  open: boolean
  onAdd: (url: string) => any
  onClose: () => any
}

const YoutubeDialog: FunctionComponent<YoutubeDialogProps> = ({
  open,
  onAdd,
  onClose,
}) => {
  const [url, setURL] = useState('')
  const [prevIsOpen, setPrevIsOpen] = useState(open)

  if (prevIsOpen !== open) {
    setPrevIsOpen(open)
    if (open) {
      setURL('')
    }
  }

  const handleChangeURL = useCallback((e: FormEvent<HTMLInputElement>) => {
    setURL(e.currentTarget.value)
  }, [])

  const handleAdd = useCallback(() => {
    onAdd(url)
    onClose()
  }, [url, onAdd, onClose])

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalHeader onClose={onClose}>Youtube 영상 추가</ModalHeader>
      <ModalBody>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="링크 주소를 입력하세요"
            value={url}
            onChange={handleChangeURL}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <button
          className="button is-info"
          type="button"
          onClick={handleAdd}
          disabled={!url}
        >
          추가하기
        </button>
      </ModalFooter>
    </Modal>
  )
}

interface MenuItemInsertYoutubeProps {
  render: (onClick: () => any) => ReactNode
}

const MenuItemInsertYoutube: FunctionComponent<MenuItemInsertYoutubeProps> = ({
  render,
}) => {
  const { applyCommand } = useProseMirror()
  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => {
    setOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleAdd = useCallback(
    (url: string) => {
      const parsedURL = parseURL(url, true)
      if (parsedURL.origin === 'https://youtu.be') {
        const videoID = parsedURL.pathname.slice(1)
        url = `https://www.youtube.com/embed/${videoID}`
      } else if (
        (parsedURL.origin === 'https://www.youtube.com' ||
          parsedURL.origin === 'https://m.youtube.com') &&
        parsedURL.pathname === '/watch'
      ) {
        const videoID = parsedURL.query.v
        url = `https://www.youtube.com/embed/${videoID}`
      }

      // <iframe width="560" height="315" src="https://www.youtube.com/embed/IkXtVbwcogY"
      // frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      const node = schema.nodes.iframe.createAndFill({
        src: url,
        frameborder: '0',
        allow:
          'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture',
        allowfullscreen: '',
        style: 'height: 315px; width: 560px;',
      })

      if (!node) {
        return
      }

      applyCommand(insertNode(node))
    },
    [applyCommand],
  )

  return (
    <>
      {render(handleClick)}
      <Portal>
        <YoutubeDialog open={open} onAdd={handleAdd} onClose={handleClose} />
      </Portal>
    </>
  )
}

export default MenuItemInsertYoutube
