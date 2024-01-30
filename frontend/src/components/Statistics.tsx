import { Typography, styled } from '@mui/material'
import Box, { BoxProps } from '@mui/material/Box'

// https://stackoverflow.com/questions/70368658/percentage-circle-border-css-react
type CirclePercentageProps = BoxProps & {
  ratio: number
}

const CirclePercentage = styled(Box, { shouldForwardProp: (prop) => prop !== 'value' })<CirclePercentageProps>(
  ({ theme, ratio }) => ({
    '--ratio': ratio,
    'height': '150px',
    'width': '150px',
    'borderRadius': '50%',
    'position': 'relative',
    'clipPath': 'circle(50%)',

    '&::before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: '0',
      left: '0',
      backgroundImage: `conic-gradient(${theme.palette.primary.dark} 0 calc(var(--ratio) * 360deg), lightgray calc(var(--ratio) * 360deg) 360deg)`,
      zIndex: -2,
    },

    '&::after': {
      content: '""',
      position: 'absolute',
      width: '80%',
      height: '80%',
      top: '10%',
      left: '10%',
      backgroundColor: 'white',
      borderRadius: '50%',
      zIndex: -1,
    },
  }),
)

type StatisticProps = BoxProps & {
  total: number
  value: number
  label: string
}

function Statistic({ total, value, label, ...props }: StatisticProps) {
  return (
    <CirclePercentage {...props} ratio={value / total}>
      <Box display="flex" height="100%" alignItems="center" justifyContent="center">
        <Box textAlign="center" color={(theme) => theme.palette.primary.dark}>
          <Typography variant="h3">{value}</Typography>
          <Typography variant="h6">{label}</Typography>
        </Box>
      </Box>
    </CirclePercentage>
  )
}

export default function Statistics() {
  return (
    <Box py={4} height="100%">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="space-between" height="100%">
        <Statistic label="Terrenos" total={4} value={3} />
        <Statistic label="Pessoas" total={100} value={89} />
        <Statistic label="Gestores" total={10} value={5} />
      </Box>
    </Box>
  )
}
