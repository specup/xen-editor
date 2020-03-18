import React, {
  FunctionComponent,
  useState,
  useCallback,
  FormEvent,
  KeyboardEvent,
} from 'react'
import { styled } from '@material-ui/core/styles'
import { ArrowUpIcon, ArrowDownIcon } from '../icons'
import { getFontSize, setMark } from './utils'
import Overlay from './Overlay'
import { useProseMirrorState, schema } from '../../prosemirror'
import { Dropdown, DropdownItem } from './base'

const Field = styled('div')({
  marginBottom: '0 !important',
})

interface FontSizeInputProps {
  value: number | null
  onFocus: () => any
  onCommit: (value: number) => any
  onClose: () => any
}

interface InputState {
  num: number
  str: string
}

function createInputState(value: number | null): InputState | null {
  if (!value) {
    return null
  }

  return {
    num: value,
    str: value.toString(),
  }
}

const Input = styled('input')({
  boxShadow: 'none',
  width: '36px !important',
})

const FontSizeInput: FunctionComponent<FontSizeInputProps> = ({
  value,
  onFocus,
  onCommit,
  onClose,
}) => {
  const [input, setInput] = useState(() => createInputState(value))
  const [prevValue, setPrevValue] = useState(value)

  if (prevValue !== value) {
    setInput(createInputState(value))
    setPrevValue(value)
  }

  const handleChange = useCallback((e: FormEvent<HTMLInputElement>) => {
    const nextValue = e.currentTarget.value

    if (!nextValue) {
      setInput(null)
      return
    }

    const num = parseInt(nextValue, 10)
    if (isNaN(num)) {
      return
    }

    setInput({ num, str: nextValue })
  }, [])

  const commit = useCallback(() => {
    if (input && input.num !== value) {
      onCommit(input.num)
    } else {
      setInput(createInputState(value))
    }
  }, [input, value, onCommit])

  const handleBlur = commit

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.keyCode === 13 /* enter */) {
        e.preventDefault()
        commit()
        onClose()
      }
    },
    [commit, onClose],
  )

  return (
    <Input
      className="input is-small is-white"
      type="text"
      value={input ? input.str : ''}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onFocus={onFocus}
      onBlur={handleBlur}
    />
  )
}

// const PRESET = [
//   8, 9, 10, 11, 12, 14, 18, 24, 30, 36, 48, 60, 72, 96,
// ]

const PRESET = [8, 9, 10, 11, 12, 13, 16, 20, 24, 30, 36, 48, 60, 72, 96]

const MenuItemFontSize: FunctionComponent = () => {
  const [open, setOpen] = useState(false)
  const [fontSize, applyCommand, view] = useProseMirrorState(getFontSize)

  const handleClick = useCallback(() => {
    setOpen(!open)
  }, [open])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  const handleCommit = useCallback(
    (value: number) => {
      applyCommand(setMark(schema.marks.font_size, { size: value }))
      view.focus()
    },
    [applyCommand, view],
  )

  const handleDropdownItemClick = useCallback(
    (value: number) => {
      handleCommit(value)
      handleClose()
    },
    [handleCommit, handleClose],
  )

  return (
    <>
      <Field className="field has-addons">
        <div className="control">
          <FontSizeInput
            value={fontSize}
            onFocus={handleClick}
            onCommit={handleCommit}
            onClose={handleClose}
          />
        </div>
        <div className="control">
          <a className="button is-small is-white" onClick={handleClick}>
            <span className="icon is-small">
              {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </span>
          </a>
        </div>
      </Field>
      <Overlay open={open} onClose={handleClose}>
        <Dropdown className="dropdown is-active">
          <div className="dropdown-menu" id="dropdown-menu3" role="menu">
            <div className="dropdown-content">
              {PRESET.map(value => (
                <DropdownItem
                  key={value}
                  currentValue={fontSize}
                  value={value}
                  onClick={handleDropdownItemClick}
                >
                  {value}
                </DropdownItem>
              ))}
            </div>
          </div>
        </Dropdown>
      </Overlay>
    </>
  )
}

export default MenuItemFontSize
