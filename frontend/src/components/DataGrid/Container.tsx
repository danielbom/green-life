import Box, { BoxProps } from '@mui/system/Box'

export function Container({ sx, ...props }: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        minWidth: 500,
        width: '100%',
        height: '100%',
        maxHeight: 'calc(100% - 66px)',
        flex: 1,
        ...sx,
      }}
    />
  )
}
