import React, { FunctionComponent, PropsWithChildren, useCallback } from 'react'
import { styled } from '@material-ui/core/styles'
import cn from 'clsx'

export const InlineBlock = styled('div')({
  display: 'inline-block',
  '& + &': {
    marginLeft: 5,
  },
})

interface ButtonsBaseProps {
  className?: string
}

const ButtonsBase: FunctionComponent<ButtonsBaseProps> = ({ className, children }) => {
  return (
    <div className={cn('buttons has-addons', className)}>
      {children}
    </div>
  )
}

export const Buttons = styled(ButtonsBase)({
  display: 'inline-block !important',
  marginBottom: '0 !important',

  '& + &': {
    marginLeft: 10,
  },

  '& > .button': {
    marginBottom: '0 !important',
  },
})

interface MenuButtonProps {
  onClick: () => any
  disabled?: boolean
  active?: boolean
}

export const MenuButton: FunctionComponent<MenuButtonProps> = ({ onClick, disabled, active, children }) => {
  return (
    <button
      type="button"
      className={cn('button is-small is-white', { 'is-active': active })}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="icon is-small">
        {children}
      </span>
    </button>
  )
}

export interface MenuAPI {
  update: () => any
}

export const Dropdown = styled('div')({
  '& .dropdown-content': {
    maxHeight: 250,
    overflowY: 'scroll',
  },

  /* width */
  '& ::-webkit-scrollbar': {
    width: 8,
  },

  /* Track */
  '& ::-webkit-scrollbar-track': {
    background: '#f1f1f1',
  },

  /* Handle */
  '& ::-webkit-scrollbar-thumb': {
    background: '#888',
  },

  /* Handle on hover */
  '& ::-webkit-scrollbar-thumb:hover': {
    background: '#555',
  },
})

interface DropdownItemProps<T> {
  currentValue: T | null
  value: T
  onClick: (value: T) => any
}

export function DropdownItem<T extends number | string>({ currentValue, value, onClick, children }: PropsWithChildren<DropdownItemProps<T>>) {
  const handleClick = useCallback(() => onClick(value), [value])

  return (
    <a
      key={value}
      className={cn('dropdown-item', { 'is-active': currentValue === value })}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}
