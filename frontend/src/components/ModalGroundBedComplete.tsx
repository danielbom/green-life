import { yupResolver } from '@hookform/resolvers/yup'
import { Box, MenuItem, SxProps, Tabs, Tab } from '@mui/material'
import TextField from '@mui/material/TextField'
import { useRef, useState } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import * as Yup from 'yup'

import ModalRegister, { sx as registerSx } from './ModalRegister'
import ErrorMessage from './ErrorMessage'

type Tab = 'close' | 'adjust'
type ModalGroundBedCompleteProps = {
  open: boolean
  onClose: (event: 'close' | 'submit', tab: Tab, values?: any) => void
}

export default function ModalGroundBedComplete({ open, onClose }: ModalGroundBedCompleteProps) {
  const [tab, setTab] = useState<Tab>('close')
  const formAdjust = useRef<FormAdjustRef>(null)
  const formClose = useRef<FormCloseRef>(null)

  return (
    <ModalRegister
      title="Editar usuário"
      open={open}
      onClose={(event) => {
        if (event === 'close') {
          onClose('close', tab)
        } else {
          switch (tab) {
            case 'close':
              formClose.current?.handleSubmit((values) => onClose('submit', tab, values))()
              break
            case 'adjust':
              formAdjust.current?.handleSubmit((values) => onClose('submit', tab, values))()
              break
          }
        }
      }}
      sx={{ content: { minHeight: '300px', minWidth: '600px' } }}
    >
      <Tabs value={tab} onChange={(_event, value) => setTab(value)} centered>
        <Tab label="Fechar" value="close" />
        <Tab label="Ajustar" value="adjust" />
      </Tabs>
      <Box height={tab === 'close' ? '100%' : '0px'} overflow="hidden">
        <FormClose formRef={formClose} />
      </Box>
      <Box height={tab === 'adjust' ? '100%' : '0px'} overflow="hidden">
        <FormAdjust formRef={formAdjust} />
      </Box>
    </ModalRegister>
  )
}

type FormAdjustRef = UseFormReturn
type FormAdjustProps = {
  formRef: React.MutableRefObject<FormAdjustRef | null>
}

function FormAdjust({ formRef }: FormAdjustProps) {
  const form = useForm({
    resolver: yupResolver(validationAdjust),
  })
  const {
    register,
    formState: { errors },
  } = form
  formRef.current = form

  return (
    <Box sx={sx.form}>
      <TextField
        {...register('endDate')}
        variant="outlined"
        fullWidth
        required
        label="Data de colheita prevista"
        InputLabelProps={{ shrink: true }}
        type="date"
        error={!!errors.endDate}
        helperText={errors.endDate?.message?.toString()}
      />
    </Box>
  )
}

type CloseValues = {
  amount: number
  unity: 'g' | 'kg' | 'u'
  endDate: Date
}
type FormCloseRef = UseFormReturn<CloseValues>
type FormCloseProps = {
  formRef: React.MutableRefObject<FormCloseRef | null>
}

function FormClose({ formRef }: FormCloseProps) {
  const form: FormCloseRef = useForm({
    resolver: yupResolver(validationClose),
    defaultValues: {
      amount: undefined as any,
      unity: 'u',
      endDate: undefined as any,
    } as CloseValues,
  })
  const {
    register,
    formState: { errors },
    watch,
  } = form
  formRef.current = form
  const unity = watch('unity')

  return (
    <Box sx={sx.form}>
      <Box sx={registerSx.row}>
        <TextField
          {...register('amount')}
          variant="outlined"
          required
          label="Quantidade recolhida"
          type="number"
          error={!!errors.amount}
          sx={{ flex: 6 }}
        />
        <TextField
          {...register('unity')}
          variant="outlined"
          required
          label="Unidade"
          select
          value={unity}
          error={!!errors.unity}
          sx={{ flex: 4 }}
        >
          <MenuItem value="g">gramas</MenuItem>
          <MenuItem value="kg">kilogramas</MenuItem>
          <MenuItem value="u">unidade</MenuItem>
        </TextField>
        <TextField
          {...register('endDate')}
          variant="outlined"
          required
          label="Data de colheita"
          InputLabelProps={{ shrink: true }}
          type="date"
          error={!!errors.endDate}
          sx={{ flex: 4 }}
        />
      </Box>
      <ErrorMessage errors={[errors.amount, errors.unity, errors.endDate]} />
    </Box>
  )
}

const validationClose = Yup.object().shape({
  amount: Yup.number().typeError('Quantidade é obrigatório').required('Quantidade é obrigatória'),
  unity: Yup.string().required('Unidade é obrigatória'),
  endDate: Yup.date()
    .typeError('Data de colheita é obrigatória')
    .required('Data de colheita é obrigatória')
    .min(new Date(2000), 'Ano de colheita deve ser maior que 2000'),
})

const validationAdjust = Yup.object().shape({
  endDate: Yup.date().typeError('Data inválida').required('Campo é obrigatória'),
})

const sx = {
  form: {
    py: 1,
  } as SxProps,
}
