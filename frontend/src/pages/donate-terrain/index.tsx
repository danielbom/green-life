import { Box, TextField, Typography } from '@mui/material'
import LayoutInitial from '../../layout/LayoutInitial'
import background from '../../assets/images/bg-donate-terrain.png'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import useLoadingAsync from '../../hooks/useLoadingAsync'
import { paths } from '../../Router'
import { api } from '../../services/api'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { RefObject, useRef } from 'react'
import { formatISODate } from '../../utilities/formatISODate'

export function DonateTerrainPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [_isLoadingAsyncAction, wrapAsyncAction] = useLoadingAsync()
  const navigate = useNavigate()

  return (
    <LayoutInitial.Container background={background}>
      <LayoutInitial.Content>
        <LayoutInitial.Title variant="donate" />
        <DonateTerrainForm
          formRef={formRef}
          onSubmit={async (values) => {
            try {
              await wrapAsyncAction(async () => {
                await api.groundsDonate.store({
                  name: values.name,
                  address: values.address,
                  birth_date: formatISODate(values.birthDate),
                  cellphone: values.phone,
                  email: values.email,
                  ground_address: values.terrainAddress,
                })
                navigate(paths.landing)
              })
              return true
            } catch (error) {
              // TOOD: handle error
              console.log(error)
              return false
            }
          }}
        />
        <LayoutInitial.Actions>
          <LayoutInitial.PrimaryButton
            text="Enviar"
            onClick={() => {
              formRef.current?.requestSubmit()
            }}
          />
        </LayoutInitial.Actions>
      </LayoutInitial.Content>
    </LayoutInitial.Container>
  )
}

type DonateTerrainFormProps = {
  formRef: RefObject<HTMLFormElement> | null
  onSubmit: (values: FormValues) => Promise<boolean>
}

function DonateTerrainForm({ formRef, onSubmit }: DonateTerrainFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: yupResolver(validation),
  })

  async function _onSubmit(values: FormValues) {
    if (await onSubmit(values)) reset()
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit((values) => _onSubmit(values))}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <LayoutInitial.TextContainer>
          <AccountCircleIcon />
          <TextField {...register('name')} error={!!errors.name} type="text" label="Nome" variant="outlined" />
        </LayoutInitial.TextContainer>
        <LayoutInitial.TextContainer>
          <EmailIcon />
          <TextField {...register('email')} error={!!errors.email} type="email" label="Email" variant="outlined" />
        </LayoutInitial.TextContainer>
        <LayoutInitial.TextRow>
          <LayoutInitial.TextContainer>
            <CalendarMonthIcon />
            <TextField
              {...register('birthDate')}
              error={!!errors.birthDate}
              type="date"
              label="Nascimento"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
            />
          </LayoutInitial.TextContainer>
          <LayoutInitial.TextContainer>
            <PhoneIcon />
            <TextField {...register('phone')} error={!!errors.phone} type="text" label="Telefone" variant="outlined" />
          </LayoutInitial.TextContainer>
        </LayoutInitial.TextRow>
        <LayoutInitial.TextContainer>
          <LocationOnIcon />
          <TextField
            {...register('address')}
            error={!!errors.address}
            type="text"
            label="Endereço"
            variant="outlined"
          />
        </LayoutInitial.TextContainer>
        <LayoutInitial.TextContainer>
          <LocationOnIcon />
          <TextField
            {...register('terrainAddress')}
            error={!!errors.terrainAddress}
            type="text"
            label="Endereço do terreno"
            variant="outlined"
          />
        </LayoutInitial.TextContainer>
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          Fique de olho no seu email, pois entraremos em contato para formalizar o seu registro e fornecer mais
          informações.
        </Typography>
      </Box>
    </form>
  )
}

const validation = Yup.object().shape({
  name: Yup.string().required('Nome é obrigatório'),
  email: Yup.string().email('Email inválido').required('Email é obrigatório'),
  birthDate: Yup.date().typeError('Data de nascimento é obrigatória').required('Data de nascimento é obrigatória'),
  phone: Yup.string().required('Telefone é obrigatório'),
  address: Yup.string().required('Endereço é obrigatório'),
  terrainAddress: Yup.string().required('Endereço do terreno é obrigatório'),
})

type FormValues = Yup.InferType<typeof validation>
