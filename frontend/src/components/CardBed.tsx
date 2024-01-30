import { Box, Typography } from '@mui/material'
import bedSymbol from '../assets/images/bed-symbol.png'
import { blue } from '../theme'
import GrassIcon from '@mui/icons-material/Grass'

// https://getcssscan.com/css-box-shadow-examples

type BedStatus = keyof typeof colors

type CardBedProps = {
  status: BedStatus
  label?: string
  user: string
  period: string
  plant: string
}

function CardBed({ status, label, user, period, plant }: CardBedProps) {
  const height = '80px'
  const { borderColor, backgroundColor, contrastText } = colors[status]

  return (
    <Box
      sx={{
        color: contrastText,
        borderWidth: '6px',
        borderStyle: 'solid',
        borderColor,
        borderRadius: '6px',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        padding: 0.5,
        boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          height,
          aspectRatio: '1/1',
          backgroundImage: `url(${bedSymbol})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
        }}
      />
      <Box
        width="120px"
        height={height}
        paddingY={1}
        sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontSize: '14px', lineHeight: 1, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
          >
            {user}
          </Typography>
          <Typography
            variant="body1"
            sx={{ fontSize: '10px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
          >
            {period}
          </Typography>
        </Box>
        {plant && (
          <Box display="flex" gap={0.5} alignItems="center" paddingBottom={0.5}>
            <GrassIcon sx={{ fontSize: '16px' }} />
            <Typography
              variant="body2"
              sx={{
                fontSize: '12px',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {plant}
            </Typography>
          </Box>
        )}
        {typeof label === 'string' && (
          <Typography sx={{ position: 'absolute', fontSize: '12px', bottom: 4, right: 4, lineHeight: 1 }}>
            {label}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export function CardBedFree({ label }: Pick<CardBedProps, 'label'>) {
  return <CardBed status="free" user="Usuário" period="Disponível para plantação" plant="" label={label} />
}

export function CardBedComplete(props: Omit<CardBedProps, 'status'>) {
  return <CardBed status="complete" {...props} />
}

export function CardBedOccupied(props: Omit<CardBedProps, 'status'>) {
  return <CardBed status="occupied" {...props} />
}

export const colors = {
  complete: {
    borderColor: 'white',
    backgroundColor: blue['700'],
    contrastText: 'white',
  },
  free: {
    borderColor: 'primary.main',
    backgroundColor: 'white',
    contrastText: 'primary.main',
  },
  occupied: {
    borderColor: 'white',
    backgroundColor: 'primary.main',
    contrastText: 'white',
  },
}
