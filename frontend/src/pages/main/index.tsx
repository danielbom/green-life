import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

import Statistics from '../../components/Statistics'
import Header from '../../components/Header'

export function MainPage() {
  return (
    <Container maxWidth="lg" sx={{ mx: 3 }}>
      <Header title="Início" links={['Home', 'Início']} />
      <Grid container>
        {/* Recent Orders */}
        <Grid item xs={12} md={4}></Grid>
        <Grid item xs={12} md={4}></Grid>
        {/* Recent Deposits */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 700,
            }}
          >
            <Statistics />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
