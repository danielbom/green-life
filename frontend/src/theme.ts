import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

export const green = {
  '500': '#05A66B',
  '700': '#02734A',
  '900': '#003D21',
}
export const blue = {
  '700': '#0061BA',
}

const theme = createTheme({
  palette: {
    primary: {
      main: green[500],
      dark: green[700],
      contrastText: '#fff',
      ...green,
    },
    error: {
      main: red.A400,
    },
  },
})

export default theme
