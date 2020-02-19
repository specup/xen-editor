import React, { FunctionComponent } from 'react'
import cn from 'classnames'

interface ModalProps {
  isOpen: boolean
  onClose: () => any
}

export const Modal: FunctionComponent<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <div className={cn('modal', { 'is-active': isOpen })}>
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-card">
        {children}
      </div>
    </div>
  )
}

interface ModalHeaderProps {
  onClose: () => any
}

export const ModalHeader: FunctionComponent<ModalHeaderProps> = ({ children, onClose }) => {
  return (
    <header className="modal-card-head">
      <p className="modal-card-title">
        {children}
      </p>
      <button className="delete" type="button" aria-label="close" onClick={onClose} />
    </header>
  )
}

export const ModalBody: FunctionComponent = ({ children }) => {
  return (
    <section className="modal-card-body">
      {children}
    </section>
  )
}

export const ModalFooter: FunctionComponent = ({ children }) => {
  return (
    <footer className="modal-card-foot">
      {children}
    </footer>
  )
}
