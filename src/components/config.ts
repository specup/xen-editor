import { createContext, useContext } from 'react'

export interface Config {
  apiBaseURL: string
}

export const ConfigContext = createContext<Config | null>(null)

export function useConfig(): Config {
  const config = useContext(ConfigContext)
  if (!config) {
    throw new Error('Cannot find config')
  }
  return config
}
