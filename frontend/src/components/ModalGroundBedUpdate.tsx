import { Box, Divider, FormControlLabel, Radio, SxProps, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import { useRef, useState } from 'react'
import ModalRegister, { sx as registerSx } from './ModalRegister'
import CloseIcon from '@mui/icons-material/Close'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { formatDate } from '../utilities/formatDate'
import AddIconButton from './AddIconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import useDebounce from '../hooks/useDebounce'
import DialogAlert from './DialogAlert'
import ErrorMessage from './ErrorMessage'
import { api } from '../services/api'
import { Autocomplete, Option } from './Autocomplete'

// TODO: Similar to ModalRegisterPlanningPlantation.tsx

const queryClient = new QueryClient()

type Values = {
  representant: string | null
  voluntaries: VoluntaryOption[]
}
type ModalGroundBedUpdateProps = {
  name: string
  open: boolean
  isAllocated: boolean
  onClose: (event: 'close' | 'submit', values?: Values) => void
  onClick: (event: 'planning-plantation') => void
  initialRepresentant: string | null
  initialVoluntaries?: VoluntaryOption[]
}

export default function ModalGroundBedUpdate({
  name,
  open,
  onClose,
  onClick,
  isAllocated,
  initialRepresentant,
  initialVoluntaries = [],
}: ModalGroundBedUpdateProps) {
  const [openAlert, setOpenAlert] = useState(false)
  const [representant, setRepresentant] = useState<string | null>(initialRepresentant)
  const [voluntaries, setVoluntaries] = useState<VoluntaryOption[]>(initialVoluntaries)
  const [updated, setUpdated] = useState(false)
  const values = { representant, voluntaries }

  function removeItem(index: number) {
    if (voluntaries[index].key === representant) {
      setRepresentant(null)
    }
    if (voluntaries.length !== 1) {
      if (index === 0) {
        setRepresentant(voluntaries[1].key)
      } else {
        setRepresentant(voluntaries[0].key)
      }
    }
    setVoluntaries((lastValues) => lastValues.filter((_, i) => i !== index))
    setUpdated(true)
  }

  function addItem(item: VoluntaryOption) {
    if (voluntaries.length === 0) {
      setRepresentant(item.key)
    }
    setVoluntaries((lastValues) => [...lastValues, item])
    setUpdated(true)
  }

  function selectItem(key: string) {
    setRepresentant(key)
    setUpdated(true)
  }

  function _onClose(event: 'close' | 'submit') {
    onClose(event, values)
    setVoluntaries([])
    setRepresentant(null)
    setUpdated(false)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ModalRegister
        title={`Atualização do ${name}`}
        open={open}
        onClose={(event) => {
          switch (event) {
            case 'close': {
              if (updated && voluntaries.length > 0) {
                setOpenAlert(true)
                return
              }
              _onClose('close')
              break
            }
            case 'submit': {
              _onClose('submit')
              return
            }
          }
        }}
        minWidth="500px"
        actions={
          <Box sx={sx.actions}>
            {isAllocated && (
              <Button variant="outlined" color="error" endIcon={<DeleteIcon />}>
                Desalocar
              </Button>
            )}
            <Button variant="contained" onClick={() => _onClose('submit')}>
              Salvar
            </Button>
          </Box>
        }
      >
        <ListVoluntary
          values={voluntaries}
          onRemove={removeItem}
          value={representant}
          onSelect={(newValue) => selectItem(newValue)}
        />
        <FormVoluntaryAdd alreadyAdded={voluntaries} onAdd={addItem} />
        <Divider />
        <Box display="flex" justifyContent="center">
          <Button variant="contained" onClick={() => onClick('planning-plantation')}>
            Plano de plantação
          </Button>
        </Box>
      </ModalRegister>
      <DialogAlert
        open={openAlert}
        onClose={(event) => {
          if (event === 'yes') {
            onClose('close')
          }
          setOpenAlert(false)
        }}
        message={
          <Box>
            <Typography>Você possui itens não salvos.</Typography>
            <Typography>Deseja descartá-los?</Typography>
          </Box>
        }
      />
    </QueryClientProvider>
  )
}

type ListVoluntaryProps = {
  value: string | null
  onSelect: (value: string) => void
  values: VoluntaryOption[]
  onRemove: (index: number) => void
}

function ListVoluntary({ value, onSelect, values, onRemove }: ListVoluntaryProps) {
  return (
    <Paper sx={sx.paper}>
      <List sx={sx.list}>
        {values.length === 0 && (
          <ListItem>
            <ListItemText primary="Nenhum voluntário adicionado" />
          </ListItem>
        )}
        {values.map((it, index) => (
          <ListItem disablePadding key={`planning-plantation-${index}`}>
            <Box className="item-head">
              <FormControlLabel
                control={<Radio value={it.key} checked={it.key === value} />}
                label={it.value}
                onClick={() => onSelect(it.key)}
              />
            </Box>
            <Box className="item-tail">
              <ListItemText primary={formatDate(it.startDate)} />
              <ListItemIcon>
                <IconButton onClick={() => onRemove(index)}>
                  <CloseIcon />
                </IconButton>
              </ListItemIcon>
            </Box>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}

type FormVoluntaryAddProps = {
  alreadyAdded: VoluntaryOption[]
  onAdd: (item: VoluntaryOption) => void
}

function FormVoluntaryAdd({ alreadyAdded, onAdd }: FormVoluntaryAddProps) {
  const [voluntarySelected, setVoluntarySelected] = useState<Option | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<VoluntaryOption>({
    resolver: yupResolver(validation),
  })
  const watchValue = watch('value') || ''
  const debouncedValue = useDebounce(watchValue, 500)
  const enableQuery = useRef(true)
  const peoplesRequest = useQuery(
    ['peoples', debouncedValue],
    (args) => api.peoples.index({ page: 1, page_size: 20, search: args.queryKey[1] }),
    {
      enabled: enableQuery.current,
      staleTime: 10 * 60 * 1000,
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
        if (!voluntarySelected) {
          throw new Error('Voluntário não selecionado')
        }
        enableQuery.current = true
        onAdd({ ...voluntarySelected!, startDate: values.startDate })
        setVoluntarySelected(null)
        setTimeout(() => {
          // Required to reset form and enable useQuery
          reset()
        })
      })}
    >
      <Box sx={registerSx.row}>
        <Autocomplete
          id="voluntaries-autocomplete"
          value={voluntarySelected}
          options={peoples}
          alreadyAdded={alreadyAdded}
          error={!!errors.value}
          onChange={(_event, value, reason) => {
            setVoluntarySelected(value)
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
          loading={loading}
          noOptionsText="Nenhum voluntário encontrado"
          sx={{ width: 300 }}
          TextFieldProps={{
            ...register('value'),
            label: 'Nome do voluntário',
            name: 'value',
          }}
        />
        <TextField
          {...register('startDate')}
          label="Data de início"
          variant="outlined"
          name="startDate"
          type="date"
          error={!!errors.startDate}
          InputLabelProps={{ shrink: true }}
        />
        <AddIconButton type="submit" title="Add voluntary" />
      </Box>
      <ErrorMessage errors={[errors.value, errors.startDate]} />
    </form>
  )
}

const sx = {
  actions: {
    display: 'flex',
    gap: 2,
  } as SxProps,
  paper: {
    my: 1,
    px: 2,
  } as SxProps,
  list: {
    'height': '300px',
    'overflow': 'auto',
    '& .MuiListItem-root': {
      'display': 'flex',
      'justifyContent': 'space-between',
      'alignItems': 'center',
      'py': 1,
      '& .MuiListItemIcon-root': {
        minWidth: 'auto',
      },
      '& .item-head': {
        'display': 'flex',
        'alignItems': 'center',
        'color': 'primary.main',
        'px': 1,
        'gap': 1,
        '& svg': {
          color: 'primary.main',
        },
        '& .MuiListItemText-root': {
          '& .MuiListItemText-primary': {
            width: '190px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          },
        },
      },
      '& .item-tail': {
        'display': 'flex',
        'alignItems': 'center',
        'color': 'grey.500',
        'gap': 1,
        '& svg': {
          color: 'grey.600',
        },
      },
    },
  } as SxProps,
}

type VoluntaryOption = {
  key: string
  value: string
  startDate: Date
}

const validation = Yup.object().shape({
  name: Yup.string().required('Selecionar o voluntário é obrigatório'),
  startDate: Yup.date()
    .typeError('Data de início é obrigatório')
    .required('Data de início é obrigatório')
    .min(new Date(2000), 'Ano de início deve ser maior que 2000'),
})
