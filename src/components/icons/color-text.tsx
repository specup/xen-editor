import React, { FunctionComponent, CSSProperties } from 'react'
import { Svg } from './base'

interface ColorTextIconProps {
  circleStyle: CSSProperties
}

export const ColorTextIcon: FunctionComponent<ColorTextIconProps> = ({ circleStyle }) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.33 17.08">
      <circle cx="13.45" cy="1.89" r="1.89" style={circleStyle} />
      <path d="M6.6,5.6a9.32,9.32,0,0,1-.5,2.51,9.92,9.92,0,0,1-1.19,2.34,11.27,11.27,0,0,1-1.83,2.07A12,12,0,0,1,.64,14.2a.22.22,0,0,1-.28,0L0,13.68c-.07-.12,0-.2.06-.25a10.65,10.65,0,0,0,2.22-1.49A9.84,9.84,0,0,0,4,10.13,8.83,8.83,0,0,0,5.08,8a8.41,8.41,0,0,0,.5-2.22.52.52,0,0,0-.06-.3.34.34,0,0,0-.29-.08H.64a.17.17,0,0,1-.18-.16V4.71A.16.16,0,0,1,.6,4.53H5.51a1.22,1.22,0,0,1,.92.26A1.11,1.11,0,0,1,6.6,5.6Zm3.68,11.48h-.6a.19.19,0,0,1-.21-.17V3.64a.19.19,0,0,1,.17-.21h.64a.19.19,0,0,1,.21.17V8.88h2a.25.25,0,0,1,.15,0,.13.13,0,0,1,.07.14v.5a.15.15,0,0,1-.07.13.2.2,0,0,1-.15.06h-2v7.11a.19.19,0,0,1-.17.21Z" />
    </Svg>
  )
}
