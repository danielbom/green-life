import { SxProps } from '@mui/material'

export function makeSx<T extends { [key in string]: SxProps }>(sx: T): T {
  return sx
}
