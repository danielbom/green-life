import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import ModalRegister, { sx as registerSx } from './ModalRegister'

type ModalUserUpdateProps = {
  open: boolean
  onClose: (event: 'close' | 'submit', values?: any) => void
  defaultValues?: any
}

export default function ModalUserUpdate({ open, onClose, defaultValues }: ModalUserUpdateProps) {
  const form = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation),
    defaultValues,
  })

  return (
    <form ref={form} onSubmit={handleSubmit((values) => onClose('submit', values))}>
      <ModalRegister
        title="Editar usuário"
        open={open}
        onClose={(event) => {
          if (event === 'close') {
            onClose('close')
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
        />
        <Box sx={registerSx.row}>
          <TextField
            {...register('birthDate')}
            variant="outlined"
            required
            fullWidth
            label="Nascimento"
            InputLabelProps={{ shrink: true }}
            type="date"
            error={!!errors.birthDate}
            helperText={errors.birthDate?.message?.toString()}
          />
          <TextField
            {...register('phone')}
            variant="outlined"
            required
            fullWidth
            label="Telefone"
            type="tel"
            error={!!errors.phone}
            helperText={errors.phone?.message?.toString()}
          />
        </Box>
        <TextField
          {...register('password')}
          variant="outlined"
          fullWidth
          label="Senha"
          type="password"
          error={!!errors.password}
          helperText={errors.password?.message?.toString()}
        />
        <TextField
          {...register('confirmPassword')}
          variant="outlined"
          fullWidth
          label="Confirme sua Senha"
          type="password"
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message?.toString()}
        />
      </ModalRegister>
    </form>
  )
}

const validation = Yup.object().shape({
  name: Yup.string().required('Campo obrigatório'),
  email: Yup.string().email('Email inválido').required('Campo obrigatório'),
  birthDate: Yup.date().typeError('Campo obrigatório').required('Campo obrigatório'),
  phone: Yup.string().required('Campo obrigatório'),
  password: Yup.string(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null as any], 'As senhas devem ser iguais'),
})
