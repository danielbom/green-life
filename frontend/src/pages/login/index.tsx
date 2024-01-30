import { Box, Button, Checkbox, FormControlLabel, FormGroup, Link as MuiLink, TextField } from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PasswordIcon from '@mui/icons-material/Password'
import FacebookIcon from '@mui/icons-material/Facebook'
import GoogleIcon from '@mui/icons-material/Google'
import LayoutInitial from '../../layout/LayoutInitial'
import background from '../../assets/images/bg-login.png'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLogin, api } from '../../services/api'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ErrorMessage from '../../components/ErrorMessage'
import { RefObject, useRef } from 'react'
import useLoadingAsync from '../../hooks/useLoadingAsync'
import { paths } from '../../Router'

export function LoginPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [_isLoadingAsyncAction, wrapAsyncAction] = useLoadingAsync()
  const navigate = useNavigate()

  return (
    <LayoutInitial.Container background={background}>
      <LayoutInitial.Content>
        <LayoutInitial.Title variant="wellcome" />
        <LoginForm
          formRef={formRef}
          onSubmit={(values) =>
            wrapAsyncAction(async () => {
              try {
                await api.auth.login({
                  username: values.username,
                  password: values.password,
                })
                navigate(paths.home)
              } catch (error) {
                // TOOD: handle error
                console.log(error)
              }
            })
          }
        />
        <LayoutInitial.Actions>
          <LayoutInitial.PrimaryButton
            text="Entrar"
            onClick={() => {
              formRef.current?.requestSubmit()
            }}
          />
          <Box sx={{ pt: 2 }} />
          <LayoutInitial.SecondaryButton
            onClick={() => {
              navigate(paths.register)
            }}
            text="Registrar"
          />
          <FormGroup
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <FormControlLabel control={<Checkbox defaultChecked />} label="Lembrar senha" />
            <MuiLink href="#" component={Link} to="/forgot-password">
              Esquece sua senha?
            </MuiLink>
          </FormGroup>
        </LayoutInitial.Actions>
        <Box>
          <LayoutInitial.LinedText text="Login com" />
          <Box sx={{ pt: 2, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<GoogleIcon />}
              onClick={() => {
                // TODO
              }}
            >
              Google
            </Button>
            <Button
              variant="outlined"
              color="info"
              startIcon={<FacebookIcon />}
              onClick={() => {
                // TODO
              }}
            >
              Facebook
            </Button>
          </Box>
        </Box>
      </LayoutInitial.Content>
    </LayoutInitial.Container>
  )
}

type Values = {
  username: string
  password: string
}

type LoginFormProps = {
  formRef: RefObject<HTMLFormElement> | null
  onSubmit: (values: Values) => Promise<void>
}

function LoginForm({ onSubmit, formRef }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthLogin>({
    resolver: yupResolver(validation),
    defaultValues: { username: '', password: '' },
  })

  async function _onSubmit(values: Values) {
    try {
      await onSubmit(values)
      reset()
    } catch (_error) {}
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit((values) => _onSubmit(values))}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <LayoutInitial.TextContainer>
          <AccountCircleIcon />
          <TextField
            {...register('username')}
            type="email"
            label="Email"
            error={!!errors.username}
            variant="outlined"
          />
        </LayoutInitial.TextContainer>
        <LayoutInitial.TextContainer>
          <PasswordIcon />
          <TextField
            {...register('password')}
            type="password"
            label="Senha"
            error={!!errors.password}
            variant="outlined"
          />
        </LayoutInitial.TextContainer>
        <ErrorMessage errors={[errors.username, errors.password]} />
      </Box>
    </form>
  )
}

const validation = Yup.object().shape({
  username: Yup.string().required('Email é obrigatório'),
  password: Yup.string().required('Senha é obrigatório'),
})
