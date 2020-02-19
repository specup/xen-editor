import React, { FunctionComponent, PropsWithChildren, useCallback } from 'react'
import styled from 'styled-components'
import cn from 'classnames'

export const InlineBlock = styled.div`
  display: inline-block;
  & + & {
    margin-left: 5px;
  }
`

export const Buttons = styled.div.attrs({ className: 'buttons has-addons' })`
  display: inline-block !important;
  margin-bottom: 0 !important;

  & + & {
    margin-left: 10px;
  }

  & > .button {
    margin-bottom: 0 !important;
  }
`

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

export const Dropdown = styled.div`
  & .dropdown-content {
    max-height: 250px;
    overflow-y: scroll;
  }

  /* width */
  & ::-webkit-scrollbar {
    width: 8px;
  }

  /* Track */
  & ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  /* Handle */
  & ::-webkit-scrollbar-thumb {
    background: #888;
  }

  /* Handle on hover */
  & ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`

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
