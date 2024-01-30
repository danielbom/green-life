import { Box, SxProps } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Typography from '@mui/material/Typography'
import { useRef, useState } from 'react'
import ModalRegister, { sx as registerSx } from './ModalRegister'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import CloseIcon from '@mui/icons-material/Close'
import * as Yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import DialogAlert from './DialogAlert'
import { formatDate } from '../utilities/formatDate'
import AddIconButton from './AddIconButton'
import ErrorMessage from './ErrorMessage'
import useDebounce from '../hooks/useDebounce'
import { Autocomplete, Option } from './Autocomplete'
import { api } from '../services/api'
import { useQuery } from '@tanstack/react-query'

type ModalPlanningPlantationRegisterProps = {
  open: boolean
  onClose: (event: 'close' | 'submit', values?: PlanningPlantation[]) => void
  defaultValues?: PlanningPlantation[]
}

export default function ModalPlanningPlantationRegister({
  open,
  onClose,
  defaultValues = [],
}: ModalPlanningPlantationRegisterProps) {
  const [values, setValues] = useState<PlanningPlantation[]>(defaultValues)
  const [openAlert, setOpenAlert] = useState(false)
  const [updated, setUpdated] = useState(false)

  function removeItem(index: number) {
    setValues((lastValues) => lastValues.filter((_, i) => i !== index))
    setUpdated(true)
  }

  function addItem(item: PlanningPlantation) {
    setValues((lastValues) => [...lastValues, item])
    setUpdated(true)
  }

  function _onClose(event: 'close' | 'submit') {
    onClose(event, values)
    setValues([])
    setUpdated(false)
  }

  return (
    <>
      <ModalRegister
        title="Planejamento de plantação"
        open={open}
        onClose={(event) => {
          switch (event) {
            case 'close': {
              if (updated && values.length > 0) {
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
      >
        <ListPlanningPlantation values={values} onRemove={removeItem} />
        <FormPlanningPlantationAdd onAdd={(item) => addItem(item)} />
      </ModalRegister>
      <DialogAlert
        open={openAlert}
        onClose={(event) => {
          if (event === 'yes') {
            _onClose('close')
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
    </>
  )
}

type ListPlanningPlantationProps = {
  values: PlanningPlantation[]
  onRemove: (index: number) => void
}

function ListPlanningPlantation({ values, onRemove }: ListPlanningPlantationProps) {
  return (
    <Paper sx={sx.paper}>
      <List sx={sx.list}>
        {values.length === 0 && (
          <ListItem>
            <ListItemText primary="Nenhum planejamento de plantação adicionado" />
          </ListItem>
        )}
        {values.map((it, index) => (
          <ListItem disablePadding key={`planning-plantation-${index}`}>
            <Box className="item-head">
              <ListItemIcon>
                <LocalFloristIcon />
              </ListItemIcon>
              <ListItemText primary={it.plantation} />
            </Box>
            <Box className="item-tail">
              <ListItemText primary={`${formatDate(it.startDate)} - ${formatDate(it.endDate)}`} />
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

type FormPlanningPlantationAddProps = {
  onAdd: (item: PlanningPlantation) => void
}

function FormPlanningPlantationAdd({ onAdd }: FormPlanningPlantationAddProps) {
  const [seedSelected, setSeedSelected] = useState<Option | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PlanningPlantation>({
    resolver: yupResolver(validation),
  })
  const watchValue = watch('plantation') || ''
  const debouncedValue = useDebounce(watchValue, 500)
  const enableQuery = useRef(true)
  const seedsRequest = useQuery(
    ['seeds', debouncedValue],
    (args) => api.seeds.index({ page: 1, page_size: 20, search: args.queryKey[1] }),
    {
      enabled: enableQuery.current,
      staleTime: 10 * 60 * 1000,
    },
  )
  const loading = seedsRequest.isLoading && enableQuery.current
  const seeds: Option[] = (seedsRequest.data?.data.entities || []).map((it) => ({
    key: it.id,
    value: it.name,
  }))

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onAdd(values)
        reset()
      })}
    >
      <Box sx={registerSx.content}>
        <Box sx={registerSx.row}>
          <TextField
            {...register('startDate')}
            fullWidth
            label="Data de plantio"
            variant="outlined"
            name="startDate"
            type="date"
            error={!!errors.startDate}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            {...register('endDate')}
            fullWidth
            label="Data de colheita"
            variant="outlined"
            name="endDate"
            type="date"
            error={!!errors.endDate}
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box sx={registerSx.row}>
          <Autocomplete
            id="voluntaries-autocomplete"
            value={seedSelected}
            options={seeds}
            alreadyAdded={[]}
            error={!!errors.plantation}
            onChange={(_event, value, reason) => {
              setSeedSelected(value)
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
            noOptionsText="Nenhuma plantação encontrada"
            sx={{ width: 300 }}
            TextFieldProps={{
              ...register('plantation'),
              label: 'Nome da plantação',
              name: 'plantation',
            }}
          />
          <AddIconButton type="submit" />
        </Box>
      </Box>
      <ErrorMessage errors={[errors.startDate, errors.endDate, errors.plantation]} />
    </form>
  )
}

const sx = {
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

const validation = Yup.object().shape({
  plantation: Yup.string().required('Nome da plantação é obrigatório'),
  startDate: Yup.date()
    .typeError('Data de plantio é obrigatório')
    .required('Data de plantio é obrigatório')
    .min(new Date(2000), 'Ano de plantio deve ser maior que 2000'),
  endDate: Yup.date()
    .typeError('Data de colheita é obrigatório')
    .required('Data de colheita é obrigatório')
    .min(new Date(2000), 'Ano de colheita deve ser maior que 2000')
    .min(Yup.ref('startDate'), 'Data de colheita deve ser maior que a data de plantio'),
})

type PlanningPlantation = Yup.InferType<typeof validation>
