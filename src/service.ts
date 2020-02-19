import { createContext, useContext } from 'react'
import { FileUploadUtils } from './components/FileUploadDialog'

export interface Service extends FileUploadUtils {}

export const ServiceContext = createContext<Service | null>(null)

export function useService(): Service {
  const service = useContext(ServiceContext)
  if (!service) {
    throw new Error('Cannot find service context')
  }
  return service
}
