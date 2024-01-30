import { styled, Box, Typography, Button, ButtonProps as ButtonPropsMui } from '@mui/material'

type ContainerProps = {
  background: string
}

const Container = styled(Box)<ContainerProps>(({ theme, background }) => ({
  'position': 'relative',
  'width': '100%',
  'height': '100vh',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 314,
    backgroundImage: `url(${background})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top right',
    // backgroundSize: 'cover',
    width: '100%',
    height: '100%',
    zIndex: -1,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}))

type LinedTextProps = {
  text: string
}

function LinedText({ text }: LinedTextProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', color: 'grey.400' }}>
      <Box sx={{ borderTopWidth: '1px', borderTopStyle: 'solid', flex: 1 }}></Box>
      <Typography sx={{ p: 2 }}>{text}</Typography>
      <Box sx={{ borderTopWidth: '1px', borderTopStyle: 'solid', flex: 1 }}></Box>
    </Box>
  )
}

const TitleContainer = styled(Box)(({ theme }) => ({
  'color': theme.palette.primary.dark,
  'textAlign': 'center',
  'display': 'flex',
  'flexDirection': 'column',
  'gap': theme.spacing(1),
  '& .MuiTypography-h1': {
    fontWeight: 600,
    fontSize: theme.spacing(8),
    lineHeight: theme.spacing(6),
    fontFamily: 'Inter',
  },
  '& .MuiTypography-h5': {
    fontSize: theme.spacing(2.5),
  },
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  width: theme.spacing(60),
  minHeight: '100vh',
  overflowY: 'auto',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

function Content({ children }: React.PropsWithChildren<{}>) {
  return (
    <ContentContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 6,
          height: '100vh',
          minHeight: '640px',
          px: 4,
        }}
      >
        {children}
      </Box>
    </ContentContainer>
  )
}

type TitleProps = {
  variant: 'wellcome' | 'voluntary' | 'donate'
}

const titles: Record<TitleProps['variant'], { title: string; subtitle: string }> = {
  wellcome: {
    title: 'Bem-Vindo ao Green Life',
    subtitle: 'A persistencia é o caminho do êxito.',
  },
  voluntary: {
    title: 'Seja um Voluntário Green Life',
    subtitle: 'A bondade está nas pequenas ações que oferecemos aos próximos.',
  },
  donate: {
    title: 'Doe um Terreno ao Green Life',
    subtitle: 'A bondade está nas pequenas ações que oferecemos aos próximos.',
  },
}

function Title({ variant }: TitleProps) {
  const { title, subtitle } = titles[variant]
  return (
    <TitleContainer>
      <Typography variant="h1">{title}</Typography>
      <Typography variant="h5">{subtitle}</Typography>
    </TitleContainer>
  )
}

const TextContainer = styled(Box)(({ theme }) => ({
  'display': 'flex',
  'flex': 1,
  'gap': theme.spacing(1),
  'alignItems': 'center',
  'justifyContent': 'center',
  '& .MuiTextField-root': { flex: 1 },
  '& svg': {
    color: theme.palette.primary.main,
  },
}))

const TextRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}))

type ButtonProps = { text: string } & ButtonPropsMui

function PrimaryButton({ text, ...props }: ButtonProps) {
  return (
    <Button variant="contained" fullWidth {...props}>
      {text}
    </Button>
  )
}

function SecondaryButton({ text, ...props }: ButtonProps) {
  return (
    <Button variant="outlined" fullWidth {...props}>
      {text}
    </Button>
  )
}

function Actions({ children }: React.PropsWithChildren<{}>) {
  return (
    <Box sx={{ pl: 4, display: 'flex', flexDirection: 'column', alignSelf: 'center', width: '100%' }}>{children}</Box>
  )
}

export default {
  Container,
  LinedText,
  Title,
  Content,
  TextRow,
  PrimaryButton,
  SecondaryButton,
  TextContainer,
  Actions,
}
