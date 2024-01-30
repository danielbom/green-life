import AddIcon from '@mui/icons-material/Add'
import { Box, SxProps } from '@mui/material'
import Button, { ButtonProps } from '@mui/material/Button'

export function AddButton(props: ButtonProps) {
  return (
    <Box sx={sx.container}>
      <Button variant="contained" {...props}>
        <AddIcon />
      </Button>
    </Box>
  )
}

export const sx = {
  container: {
    'display': 'flex',
    'alignItems': 'center',
    '& button': {
      padding: '10px',
    },
  } as SxProps,
}
