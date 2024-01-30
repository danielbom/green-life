import TextField from '@mui/material/TextField'
import { useEffect, useRef } from 'react'
import ModalRegister from './ModalRegister'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ErrorMessage from './ErrorMessage'
import { ToolView } from '../pages/tools/types'

type Values = {
  name: string
  amount: number
  description?: string
}

type ModaldToolRegisterOrUpdateProps = {
  open: boolean
  onClose: (event: 'close' | 'submit', values?: Values) => void
  initialValues?: ToolView | null
}

export default function ModaldToolRegisterOrUpdate({ open, onClose, initialValues }: ModaldToolRegisterOrUpdateProps) {
  const form = useRef<HTMLFormElement>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validation),
    defaultValues: initialValues || undefined,
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
        title={isUpdate ? 'Atualizar ferramenta' : 'Registro de ferramenta'}
        open={open}
        onClose={(event) => {
          if (event === 'close') {
            _onClose('close')
          } else {
            form.current?.requestSubmit()
          }
        }}
        sx={{ content: { width: 400 } }}
      >
        <TextField
          {...register('name')}
          variant="outlined"
          fullWidth
          required
          label="Nome"
          type="text"
          error={!!errors.name}
        />
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
        <ErrorMessage errors={[errors.name, errors.amount, errors.description]} />
      </ModalRegister>
    </form>
  )
}

const validation = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  amount: Yup.number().required('Quantidade é obrigatório').min(1, 'Quantidade deve ser maior que 0'),
  description: Yup.string(),
})
