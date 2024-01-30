import { Box, Button, Card, CardHeader, CardActions, CardContent, Grid, TextField } from '@mui/material'
import Header from '../../components/Header'
import { useEffect, useRef, useState } from 'react'
import { TextRow } from '../../components/TextRow'
import { CardBedFree } from '../../components/CardBed'
import useDebounce from '../../hooks/useDebounce'
import { Autocomplete, Option } from '../../components/Autocomplete'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../services/api'
import ErrorMessage from '../../components/ErrorMessage'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../Router'

export function TerrainsRegisterPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.grounds.store({
        address: values.address,
        beds_count: values.amount,
        description: values.description,
        owner_id: values.owner,
        length: values.length,
        width: values.width,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['grounds'])
    },
  })
  const [amount, setAmount] = useState(0)
  const amountDebounced = useDebounce(amount, 1000)

  function goBack() {
    navigate(paths.terrains)
  }

  useEffect(() => {
    if (mutation.isSuccess) {
      // TODO: show success message
      goBack()
    }
  }, [mutation.isSuccess])

  return (
    <Box sx={{ px: 6 }}>
      <Header title="Cadastro de Terreno" links={['Home', 'Terrenos', 'Cadastrar']} />
      <Grid container spacing={2}>
        <Grid item md={12} lg={5} width="100%">
          <TerrainForm
            onChangeAmount={setAmount}
            onSubmit={(values) => mutation.mutate(values)}
            onCancel={() => goBack()}
          />
        </Grid>
        <Grid item md={12} lg={7} width="100%">
          <TerrainsPreview amount={amountDebounced} />
        </Grid>
      </Grid>
    </Box>
  )
}

type TerrainFormProps = {
  onChangeAmount: (amount: number) => void
  onSubmit: (values: FormValues) => void
  onCancel: () => void
}

function TerrainForm({ onCancel, onSubmit, onChangeAmount }: TerrainFormProps) {
  const [ownerSelected, setOwnerSelected] = useState<Option | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validation),
    defaultValues: {} as FormValues,
  })
  const [people, setPeople] = useState('')
  const peopleDebounced = useDebounce(people, 1000)
  const enableQuery = useRef(true)
  const peoplesRequest = useQuery(
    ['peoples', peopleDebounced],
    (args) => api.peoples.index({ page: 1, page_size: 20, search: args.queryKey[1] }),
    {
      enabled: enableQuery.current,
      staleTime: 30 * 1000,
    },
  )
  const loading = peoplesRequest.isLoading && enableQuery.current
  const peoples: Option[] = (peoplesRequest.data?.data.entities || []).map((it) => ({
    key: it.id,
    value: it.name,
  }))

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit(values)
        reset()
      })}
    >
      <Card variant="outlined" sx={{ width: '100%' }}>
        <CardHeader title="Formulário de Cadastro" />
        <CardContent>
          <Autocomplete
            id="users-autocomplete"
            value={ownerSelected}
            options={peoples}
            loading={loading}
            noOptionsText="Nenhuma pessoa encontrada"
            error={!!errors.owner}
            TextFieldProps={{
              ...register('owner'),
              label: 'Proprietário',
              name: 'owner',
              fullWidth: true,
              onChange: (e) => setPeople(e.target.value),
            }}
            sx={{ mb: 2 }}
            onChange={(_event, value, reason) => {
              setOwnerSelected(value)
              switch (reason) {
                case 'selectOption':
                  enableQuery.current = false
                  break
                case 'removeOption':
                  enableQuery.current = true
                  break
                case 'clear':
                  enableQuery.current = true
                  break
                default:
                  break
              }
            }}
          />
          <TextField {...register('description')} variant="outlined" label="Nome do terreno" fullWidth sx={{ mb: 2 }} />
          <TextField {...register('address')} variant="outlined" label="Endereço do terreno" fullWidth sx={{ mb: 2 }} />
          <TextRow sx={{ mb: 2 }}>
            <TextField
              {...register('width')}
              type="number"
              label="Largura"
              variant="outlined"
              fullWidth
              error={!!errors.width}
            />
            <TextField
              {...register('length')}
              type="number"
              label="Comprimento"
              variant="outlined"
              fullWidth
              error={!!errors.length}
            />
          </TextRow>
          <TextField
            {...register('amount')}
            sx={{ mb: 2 }}
            type="number"
            label="Quantidade de lotes"
            variant="outlined"
            error={!!errors.amount}
            fullWidth
            onChange={(event) => onChangeAmount(Number(event.target.value))}
          />
          <ErrorMessage errors={[errors.owner, errors.description, errors.width, errors.length, errors.amount]} />
        </CardContent>
        <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              onCancel()
              reset()
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Salvar
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}

type TerrainsPreviewProps = {
  amount: number
}

function TerrainsPreview({ amount }: TerrainsPreviewProps) {
  const columns = Math.ceil(Math.sqrt(amount))

  return (
    <Card variant="outlined" sx={{ width: '100%', maxHeight: '80vh' }}>
      <CardHeader title="Pré-Visualização" />
      <CardContent sx={{ display: 'flex', height: '100%' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '1rem',
            overflow: 'auto',
            maxHeight: '70vh',
            pb: 2,
          }}
        >
          {Array.from({ length: amount }, (_, index) => {
            return <CardBedFree key={`bed-preview-${index}`} label={`${index + 1}`} />
          })}
        </Box>
      </CardContent>
    </Card>
  )
}

const validation = Yup.object().shape({
  owner: Yup.string().required('Proprietário é obrigatório'),
  address: Yup.string().required('Endereço é obrigatório'),
  description: Yup.string().required('Descrição é obrigatório'),
  width: Yup.number().positive().required('Largura é obrigatório'),
  length: Yup.number().positive().required('Comprimeto é obrigatório'),
  amount: Yup.number().positive().required('Quantidade é obrigatório'),
})

type FormValues = Yup.InferType<typeof validation>
