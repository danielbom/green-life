import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  styled,
} from '@mui/material'
import { Link } from 'react-router-dom'
import FacebookIcon from '@mui/icons-material/Facebook'
import WhatsappIcon from '@mui/icons-material/WhatsApp'
import InstagramIcon from '@mui/icons-material/Instagram'
import LoginIcon from '@mui/icons-material/Login'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import PeopleIcon from '@mui/icons-material/People'
import landingFamily from '../../assets/images/landing-family.png'
import landingPlants1 from '../../assets/images/landing-plants1.png'
import landingPlants2 from '../../assets/images/landing-plants2.png'
import donate from '../../assets/images/landing-donate.png'
import donateBackground from '../../assets/images/landing-donate-background.png'
import availableGardensBackground from '../../assets/images/landing-available-gardens-background.png'
import locationExample from '../../assets/images/landing-location-example.png'
import { makeSx } from '../../utilities/makeSx'

// https://yqnn.github.io/svg-path-editor/
// https://bennettfeely.com/clippy/

export default function LandingPage() {
  return (
    <Box sx={sx.page}>
      <Box component="header" className="header" sx={sx.header}>
        <Drawable.SpecialShapeHeader />
        <Box className="header__nav-start">
          <Link to="/home">
            <Typography variant="h6">Home</Typography>
          </Link>
          <Link to="/contacts">
            <Typography variant="h6">Contatos</Typography>
          </Link>
        </Box>
        <Link to="/login">
          <Box className="header__nav-end">
            <Typography variant="h6">Realizar login</Typography>
            <LoginIcon />
          </Box>
        </Link>
      </Box>
      <Box component="section">
        <Typography variant="h2" sx={sx.h1}>
          Venha conhecer a nossa horta comunitária
        </Typography>
        <Drawable.FamilyImage />
        <Drawable.SpecialShapeSection1 />
      </Box>
      <Box component="section">
        <Drawable.GreenBackgroundSection />
        <Drawable.PlantationImage1 />
        <Box sx={sx.sectionText}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras viverra id tellus a condimentum. Nullam
            porttitor arcu maximus, suscipit eros eu, laoreet lorem. Cras laoreet libero vitae erat vulputate, at
            pulvinar ipsum tempor. Cras hendrerit ipsum tempor, eleifend dolor at, feugiat ex. Aenean tincidunt semper
            tristique. Quisque molestie eros quis suscipit maximus.{' '}
          </Typography>
        </Box>
      </Box>
      <Box component="section">
        <Box sx={sx.sectionText}>
          <Typography>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras viverra id tellus a condimentum. Nullam
            porttitor arcu maximus, suscipit eros eu, laoreet lorem. Cras laoreet libero vitae erat vulputate, at
            pulvinar ipsum tempor. Cras hendrerit ipsum tempor, eleifend dolor at, feugiat ex. Aenean tincidunt semper
            tristique. Quisque molestie eros quis suscipit maximus.{' '}
          </Typography>
        </Box>
        <Drawable.GreenBackgroundSection />
        <Drawable.PlantationImage2 />
      </Box>
      <Box component="section" className="available-gardens" sx={sx.availableGardens}>
        <Box className="available-gardens__content">
          <Typography variant="h3" className="available-gardens__title" color="primary.900">
            Hortas disponiveis na região
          </Typography>
          <Button
            LinkComponent={Link}
            variant="contained"
            {...{ to: 'donate-terrain' }}
            className="available-gardens__button"
          >
            Doar um terreno
          </Button>
        </Box>
        <Box className="available-gardens__list-container">
          <Box className="available-gardens__list-scroll">
            <Grid container spacing={2} className="available-gardens__list">
              <Grid item>
                <CardExample />
              </Grid>
              <Grid item>
                <CardExample />
              </Grid>
              <Grid item>
                <CardExample />
              </Grid>
              <Grid item>
                <CardExample />
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>
      <Box component="section" className="community-association" sx={sx.communiteAssociation}>
        <Box className="community-association__content">
          <Typography variant="h2" className="community-association__title">
            Participe desta comunidade!
          </Typography>
          <Typography variant="subtitle1" className="community-association__subtitle">
            Venha trabalhar conosco para tornar a sua vida e a de outras pessoas uma vida mais saudável e melhor.
          </Typography>
          <Button
            LinkComponent={Link}
            variant="contained"
            {...{ to: 'voluntary-request' }}
            className="community-association__button"
          >
            Seja um voluntário
          </Button>
        </Box>
        <Box className="community-association__image" />
      </Box>
      <Box component="footer" className="footer" sx={sx.footer}>
        <Box className="footer__icons">
          <IconButton>
            <FacebookIcon />
          </IconButton>
          <IconButton>
            <WhatsappIcon />
          </IconButton>
          <IconButton>
            <InstagramIcon />
          </IconButton>
        </Box>
        <Typography variant="subtitle1" align="center" color="white" mt={2}>
          Todos os direitos reservados
        </Typography>
        <Typography variant="body2" align="center" color="white">
          © 2023 Green Life
        </Typography>
      </Box>
    </Box>
  )
}

function CardExample() {
  return (
    <Card sx={{ width: '310px' }}>
      <CardMedia component="img" height="160" image={locationExample} alt="Location" />
      <CardContent>
        <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          16 Voluntário <PeopleIcon />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rua Pereira Mendes, n 18
        </Typography>
      </CardContent>
      <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          Updated to 3 week
        </Typography>
        <Button endIcon={<ChevronRightIcon />} variant="outlined" size="small">
          Conhecer horta
        </Button>
      </CardActions>
    </Card>
  )
}

const sx = makeSx({
  page: {
    'position': 'relative',
    '& section': {
      position: 'relative',
    },
    '& section:nth-of-type(1)': {
      px: 10,
      display: 'flex',
      justifyContent: 'space-between',
    },
    '& section:nth-of-type(2)': {
      display: 'flex',
    },
    '& section:nth-of-type(3)': {
      my: 4,
      display: 'flex',
      justifyContent: 'end',
    },
  },
  availableGardens: {
    '&.available-gardens': {
      pl: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      height: '500px',
      width: '100%',
      maxWidth: '100vw',
    },
    '& .available-gardens__content': {
      display: 'flex',
      flexDirection: 'column',
      width: '300px',
    },
    '& .available-gardens__content:before': {
      content: '""',
      position: 'absolute',
      top: '0',
      left: '0',
      height: '500px',
      aspectRatio: '88/150',
      background: `url(${availableGardensBackground}) no-repeat`,
      backgroundSize: 'cover',
    },
    '& .available-gardens__title': {
      mb: 4,
      fontWeight: '700',
    },
    '& .available-gardens__button': {
      alignSelf: 'center',
    },
    '& .available-gardens__list-container': {
      display: 'flex',
      p: 4,
      backgroundColor: '#01402331',
      maxWidth: '70vw',
      borderRadius: 2,
    },
    '& .available-gardens__list-scroll': {
      overflowX: 'auto',
      whiteSpace: 'nowrap',
      pb: 1,
    },
    '& .available-gardens__list': {
      flexWrap: 'nowrap',
      gap: 2,
    },
  },
  communiteAssociation: {
    '&.community-association': {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      my: 5,
      pl: 10,
    },
    '& .community-association__content': {
      width: '500px',
      display: 'flex',
      flexDirection: 'column',
    },
    '& .community-association__title': {
      fontWeight: '900',
      mb: 4,
    },
    '& .community-association__subtitle': {
      mb: 6,
    },
    '& .community-association__button': {
      alignSelf: 'center',
    },
    '& .community-association__image': {
      position: 'relative',
      height: '700px',
      width: '700px',
      background: `url(${donate}) no-repeat`,
      zIndex: -1,
    },
    '& .community-association__image:before': {
      content: '""',
      position: 'absolute',
      top: 0,
      right: 0,
      height: '700px',
      width: '900px',
      background: `url(${donateBackground}) no-repeat`,
      opacity: 0.4,
      zIndex: -1,
    },
  },
  footer: {
    '&.footer': {
      position: 'relative',
      py: 7.5,
      backgroundColor: 'primary.900',
    },
    '& .footer__icons': {
      display: 'flex',
      justifyContent: 'center',
      gap: 1,
      color: 'white',
    },
    '& .footer__icons svg': {
      border: '2px solid white',
      width: 60,
      height: 60,
      padding: 1,
      borderRadius: '50%',
      color: 'white',
    },
  },
  sectionText: {
    'maxWidth': '35%',
    'height': '400px',
    'textAlign': 'justify',
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'color': 'white',
    '& p': {
      maxHeight: '168px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  header: {
    '&.header': {
      display: 'flex',
      justifyContent: 'space-between',
      px: 10,
      pt: 3,
      pb: 10,
      fontSize: 20,
    },
    '& a': {
      textDecoration: 'none',
      color: 'inherit',
    },
    '& .header__nav-start': {
      display: 'flex',
      alignItems: 'center',
      gap: 3,
      color: 'primary.dark',
    },
    '& .header__nav-end': {
      display: 'flex',
      alignItems: 'center',
      color: 'white',
    },
    '& .header__nav-end svg': {
      ml: 1,
    },
  },
  h1: {
    maxWidth: '500px',
    fontWeight: '900',
  },
})

const Drawable = {
  SpecialShapeHeader: styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    right: 0,
    objectFit: 'cover',
    backgroundColor: theme.palette.primary.dark,
    width: '500px',
    height: '200px',
    zIndex: -1,
    clipPath: 'path("M 0 0 L 603.68 0 V 63 Q 414.7 105.27 366 83.6 T 293 70.4 Q 168 103.4 0 0")',
  })),
  FamilyImage: styled(Box)({
    background: `url(${landingFamily})`,
    height: 400,
    width: 400,
    backgroundSize: 'cover',
  }),
  GreenBackgroundSection: styled(Box)(({ theme }) => ({
    '&': {
      position: 'absolute',
      transform: 'translate(-50%, -50%)',
      height: 200,
      width: '90%',
      minWidth: '1000px',
      top: '50%',
      left: '50%',
      zIndex: -1,
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      height: 'calc(100% - 10px)',
      width: `100%`,
      transform: 'translate(-50%, -50%)',
      top: '50%',
      left: '50%',
      clipPath: 'polygon(120px 0, calc(100% - 120px) 0, 100% 50%, calc(100% - 120px) 100%, 120px 100%, 0% 50%)',
      backgroundColor: (theme.palette.primary as any)[900],
    },
    '&:after': {
      content: '""',
      position: 'absolute',
      height: '100%',
      width: `calc(100% - 35px)`,
      transform: 'translate(-50%, -50%)',
      top: '50%',
      left: '50%',
      clipPath: 'polygon(120px 0, calc(100% - 120px) 0, 100% 50%, calc(100% - 120px) 100%, 120px 100%, 0% 50%)',
      backgroundColor: (theme.palette.primary as any)[700],
    },
  })),
  SpecialShapeSection1: styled(Box)({
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'primary.dark',
    width: '40%',
    height: '140px',
    clipPath: 'path("M 0 150 L 680 155 Q 506 10 397 57 Q 355 71 299 47 T 0 70 Z")',
    zIndex: -1,
  }),
  PlantationImage1: styled(Box)({
    height: 400,
    width: '50%',
    background: `url(${landingPlants1})`,
    backgroundSize: 'cover',
    clipPath: 'polygon(0 0, 80% 0%, 100% 100%, 0% 100%)',
  }),
  PlantationImage2: styled(Box)({
    height: 400,
    width: '50%',
    background: `url(${landingPlants2})`,
    backgroundSize: 'cover',
    clipPath: 'polygon(20% 0, 100% 0%, 100% 100%, 0% 100%)',
  }),
}
