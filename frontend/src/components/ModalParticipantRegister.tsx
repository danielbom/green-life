import { Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useRef } from 'react'
import ModalRegister, { sx as registerSx } from './ModalRegister'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

type ModalParticipantRegisterProps = {
  open: boolean
  onClose: (event: 'close' | 'submit', values?: any) => void
}

export default function ModalParticipantRegister({ open, onClose }: ModalParticipantRegisterProps) {
  const form = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validation),
  })

  return (
    <form ref={form} onSubmit={handleSubmit((values) => onClose('submit', values))}>
      <ModalRegister
        title="Registrar participante"
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
          label="Nome"
          type="text"
          error={!!errors.name}
          helperText={errors.name?.message?.toString()}
        />
        <TextField
          {...register('email')}
          variant="outlined"
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
            fullWidth
            label="Telefone"
            type="tel"
            error={!!errors.phone}
            helperText={errors.phone?.message?.toString()}
          />
        </Box>
        <TextField
          {...register('address')}
          variant="outlined"
          fullWidth
          label="Endereço"
          type="text"
          error={!!errors.address}
          helperText={errors.address?.message?.toString()}
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
  address: Yup.string().required('Campo obrigatório'),
})
