import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Router } from './Router'
import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from './theme.ts'

const queryClient = new QueryClient()

// https://github.com/mui/material-ui/blob/master/examples/material-vite/src/App.jsx
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Router />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
