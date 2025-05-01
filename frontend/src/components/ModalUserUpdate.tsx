import { yupResolver } from '@hookform/resolvers/yup'
import TextField from '@mui/material/TextField'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import ModalRegister from './ModalRegister'

type Values = {
  name: string
  email: string
  cellphone: string
  password?: string
  confirmPassword?: string
}

type ModalUserUpdateProps = {
  open: boolean
  isLoading: boolean
  onClose: (event: 'close' | 'submit', values?: Values) => void
  initialValues?: Values
}

export default function ModalUserUpdate({ open, isLoading, onClose, initialValues }: ModalUserUpdateProps) {
  const form = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validation),
    defaultValues: initialValues,
  })

  function onCloseAndReset(event: 'close' | 'submit', values?: any) {
    onClose(event, values)
    reset(initialValues)
  }

  // TODO: Try remove this useEffect
  useEffect(() => reset(initialValues || undefined), [initialValues, reset])

  return (
    <form ref={form} onSubmit={handleSubmit((values) => onCloseAndReset('submit', values))}>
      <ModalRegister
        title="Editar usuário"
        open={open}
        onClose={(event) => {
          if (event === 'close') {
            onCloseAndReset('close')
          } else {
            form.current?.requestSubmit()
          }
        }}
      >
        <TextField
          {...register('name')}
          variant="outlined"
          fullWidth
          required
          label="Nome"
          type="text"
          error={!!errors.name}
          helperText={errors.name?.message?.toString()}
          disabled={isLoading}
        />
        <TextField
          {...register('email')}
          variant="outlined"
          required
          fullWidth
          label="Email"
          type="email"
          error={!!errors.email}
          helperText={errors.email?.message?.toString()}
          disabled={isLoading}
        />
        <TextField
          {...register('cellphone')}
          variant="outlined"
          required
          fullWidth
          label="Telefone"
          type="tel"
          error={!!errors.cellphone}
          helperText={errors.cellphone?.message?.toString()}
          disabled={isLoading}
        />
        <TextField
          {...register('password')}
          variant="outlined"
          fullWidth
          label="Senha"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
          disabled={isLoading}
        />
        <TextField
          {...register('confirmPassword')}
          variant="outlined"
          fullWidth
          label="Confirme sua Senha"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message?.toString()}
          disabled={isLoading}
        />
      </ModalRegister>
    </form>
  )
}

const validation = Yup.object().shape({
  name: Yup.string().required('Campo obrigatório'),
  email: Yup.string().email('Email inválido').required('Campo obrigatório'),
  cellphone: Yup.string().required('Campo obrigatório'),
  password: Yup.string(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null as any], 'As senhas devem ser iguais'),
})
