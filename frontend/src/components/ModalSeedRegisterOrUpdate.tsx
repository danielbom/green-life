import { MenuItem } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useEffect, useRef } from 'react'
import ModalRegister from './ModalRegister'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ErrorMessage from './ErrorMessage'
import { SeedView } from '../pages/seeds/types'

type Values = {
  name: string
  type: string
  amount: number
  description?: string
}

type ModalSeedRegisterOrUpdateProps = {
  open: boolean
  onClose: (event: 'close' | 'submit', values?: Values) => void
  initialValues?: SeedView | null
}

export default function ModalSeedRegisterOrUpdate({ open, onClose, initialValues }: ModalSeedRegisterOrUpdateProps) {
  const form = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: yupResolver(validation),
    defaultValues: initialValues || undefined,
  })
  const isUpdate = !!initialValues
  const type = watch('type') || 'fruit'

  function _onClose(event: 'close' | 'submit', values?: any) {
    onClose(event, values)
    reset()
  }

  // TODO: Try remove this useEffect
  useEffect(() => reset(initialValues || undefined), [initialValues, reset])

  return (
    <form ref={form} onSubmit={handleSubmit((values) => _onClose('submit', values))}>
      <ModalRegister
        title={isUpdate ? 'Atualizar semente' : 'Registrar semente'}
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
          label="Semente"
          type="text"
          error={!!errors.name}
        />
        <TextField
          {...register('type')}
          variant="outlined"
          required
          fullWidth
          label="Tipo de semente"
          select
          value={type}
          error={!!errors.type}
        >
          <MenuItem value="fruit">Fruta</MenuItem>
          <MenuItem value="vegetable">Verdura</MenuItem>
          <MenuItem value="legume">Legume</MenuItem>
          <MenuItem value="other">Outro</MenuItem>
        </TextField>
        <TextField
          {...register('amount')}
          variant="outlined"
          required
          fullWidth
          label="Quantidade"
          type="number"
          error={!!errors.amount}
        />
        <TextField
          {...register('description')}
          variant="outlined"
          fullWidth
          label="Descrição"
          type="text"
          multiline
          rows={4}
          error={!!errors.description}
        />
        <ErrorMessage errors={[errors.name, errors.type, errors.amount, errors.description]} />
      </ModalRegister>
    </form>
  )
}

const validation = Yup.object().shape({
  name: Yup.string().required('Semente é obrigatório'),
  type: Yup.string(),
  amount: Yup.number()
    .typeError('Quantidade é obrigatório')
    .required('Quantidade é obrigatório')
    .min(1, 'Quantidade deve ser maior que 0'),
  description: Yup.string(),
})
