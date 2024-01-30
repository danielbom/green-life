import { Box, TextField, Typography } from '@mui/material'
import LayoutInitial from '../../layout/LayoutInitial'
import EmailIcon from '@mui/icons-material/Email'
import background from '../../assets/images/bg-login.png'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { ErrorMessageBox } from '../../components/ErrorMessage'
import useErrorMessage from '../../hooks/useErrorMessage'
import { paths } from '../../Router'

type Values = { email: string }

export function ForgotPasswordPage() {
  const [error, setError] = useErrorMessage()
  const [values, setValues] = useState<Values>({ email: '' })
  const navigate = useNavigate()

  return (
    <LayoutInitial.Container background={background}>
      <LayoutInitial.Content>
        <LayoutInitial.Title variant="wellcome" />
        <ForgotPasswordForm values={values} setValues={setValues} error={error} />
        <LayoutInitial.Actions>
          <LayoutInitial.PrimaryButton
            text="Enviar"
            onClick={() => {
              if (!values.email) {
                setError('Email é obrigatório')
                return
              }
            }}
          />
          <LayoutInitial.LinedText text="Tudo certo?" />
          <LayoutInitial.SecondaryButton
            text="Entrar"
            onClick={() => {
              navigate(paths.login)
            }}
          />
        </LayoutInitial.Actions>
      </LayoutInitial.Content>
    </LayoutInitial.Container>
  )
}

type ForgotPasswordFormProps = {
  values: Values
  setValues: (value: Values) => void
  error: string | undefined
}

function ForgotPasswordForm({ values, setValues, error }: ForgotPasswordFormProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', fontWeight: 'normal', fontSize: '1.25rem' }}>
        Recuperar senha
      </Typography>
      <LayoutInitial.TextContainer>
        <EmailIcon />
        <TextField
          type="email"
          label="Email"
          value={values.email}
          onChange={(event) => setValues({ email: event.target.value })}
        />
      </LayoutInitial.TextContainer>
      {error && <ErrorMessageBox>{error}</ErrorMessageBox>}
    </Box>
  )
}
