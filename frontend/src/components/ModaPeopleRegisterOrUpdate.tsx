import { yupResolver } from '@hookform/resolvers/yup'
import { Box } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'

import ModalRegister, { sx as registerSx } from './ModalRegister'
import { PeopleStore } from '../services/api'

type Values = {
  name: string
  email: string
  cellphone: string
  birth_date: string
  address: string
}

type ModalPeopleRegisterOrUpdateProps = {
  open: boolean
  onClose: (event: 'close' | 'submit', values?: Values) => void
  initialValues?: PeopleStore
}

export default function ModalPeopleRegisterOrUpdate({
  open,
  onClose,
  initialValues,
}: ModalPeopleRegisterOrUpdateProps) {
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
  const isUpdate = !!initialValues

  function _onClose(event: 'close' | 'submit', values?: any) {
    onClose(event, values)
    reset()
  }

  // TODO: Try remove this useEffect
  useEffect(() => reset(initialValues || undefined), [initialValues, reset])

  return (
    <form ref={form} onSubmit={handleSubmit((values) => _onClose('submit', values))}>
      <ModalRegister
        title={isUpdate ? 'Atualizar pessoa' : 'Registro de pessoa'}
        open={open}
        onClose={(event) => {
          if (event === 'close') {
            _onClose('close')
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
            {...register('birth_date')}
            variant="outlined"
            required
            fullWidth
            label="Nascimento"
            InputLabelProps={{ shrink: true }}
            type="date"
            error={!!errors.birth_date}
            helperText={errors.birth_date?.message?.toString()}
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
          />
        </Box>
        <TextField
          {...register('address')}
          variant="outlined"
          required
          fullWidth
          label="Endereço"
          error={!!errors.address}
          helperText={errors.address?.message?.toString()}
        />
      </ModalRegister>
    </form>
  )
}

const validation = Yup.object<PeopleStore>().shape({
  name: Yup.string().required('Campo obrigatório'),
  email: Yup.string().email('Email inválido').required('Campo obrigatório'),
  cellphone: Yup.string().required('Campo obrigatório'),
  birth_date: Yup.date().typeError('Campo obrigatório').required('Campo obrigatório'),
  address: Yup.string().required('Campo obrigatório'),
})
