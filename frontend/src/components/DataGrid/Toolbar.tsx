import { BoxProps, Box } from '@mui/material'

export function Toolbar(props: BoxProps) {
  return <Box {...props} pb={1.5} display="flex" gap={1.5} />
}
