import { Box, TextField } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import PasswordIcon from '@mui/icons-material/Password'
import LayoutInitial from '../../layout/LayoutInitial'
import background from '../../assets/images/bg-login.png'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../Router'

export function RegisterPage() {
  const navigate = useNavigate()

  return (
    <LayoutInitial.Container background={background}>
      <LayoutInitial.Content>
        <LayoutInitial.Title variant="wellcome" />
        <RegisterForm />
        <LayoutInitial.Actions>
          <LayoutInitial.PrimaryButton
            onClick={() => {
              navigate(paths.login)
            }}
            text="Registrar"
          />
          <LayoutInitial.LinedText text="Já possui cadastro?" />
          <LayoutInitial.SecondaryButton
            onClick={() => {
              navigate(paths.login)
            }}
            text="Entrar"
          />
        </LayoutInitial.Actions>
      </LayoutInitial.Content>
    </LayoutInitial.Container>
  )
}

function RegisterForm() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <LayoutInitial.TextContainer>
        <AccountCircleIcon />
        <TextField type="text" label="Nome" variant="outlined" />
      </LayoutInitial.TextContainer>
      <LayoutInitial.TextContainer>
        <EmailIcon />
        <TextField type="email" label="Email" variant="outlined" />
      </LayoutInitial.TextContainer>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <LayoutInitial.TextContainer>
          <CalendarMonthIcon />
          <TextField type="date" label="Nascimento" InputLabelProps={{ shrink: true }} variant="outlined" />
        </LayoutInitial.TextContainer>
        <LayoutInitial.TextContainer>
          <PhoneIcon />
          <TextField type="text" label="Telefone" variant="outlined" />
        </LayoutInitial.TextContainer>
      </Box>
      <LayoutInitial.TextContainer>
        <PasswordIcon />
        <TextField type="password" label="Senha" variant="outlined" />
      </LayoutInitial.TextContainer>
      <LayoutInitial.TextContainer>
        <PasswordIcon />
        <TextField type="password" label="Confirme sua senha" variant="outlined" />
      </LayoutInitial.TextContainer>
    </Box>
  )
}
