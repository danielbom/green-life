import { Box, Card, CardActions, CardContent, Grid, Typography, CircularProgress } from '@mui/material'
import { CardBedFree, CardBedOccupied, CardBedComplete, colors } from '../../components/CardBed'

import { useParams } from 'react-router-dom'
import { Bed, BedSchedule, BedSchedules, Ground, Seed, Voluntary, api } from '../../services/api'
import { QueryFunctionContext, useQueries, useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import Header from '../../components/Header'
import ModalGroundBedUpdate from '../../components/ModalGroundBedUpdate'
import { formatDate } from '../../utilities/formatDate'
import { formatISODate } from '../../utilities/formatISODate'
import ModalPlanningPlantationRegister from '../../components/ModalPlanningPlantationRegister'
import ModalGroundBedInfo from '../../components/ModalGroundBedInfo'

export function TerrainsShowPage() {
  const { id } = useParams<{ id: string }>()
  const groundRequest = useQuery(['ground', id!] as const, (args) => api.grounds.show(args.queryKey[1]))
  const ground = groundRequest?.data?.data
  const [bedSchedules, setBedSchedules] = useState<BedSchedules | null>(null)
  const [selectedBedData, setSelectedBedData] = useState<BedData | null>(null)
  const [groundBedInfoModalOpen, setGroundBedInfoModalOpen] = useState(false)
  const [groundBedUpdateModalOpen, setGroundBedUpdateModalOpen] = useState(false)
  const [planningPlantationModalOpen, setPlanningPlantationModalOpen] = useState(false)
  const seedsRequests = useQueries({
    queries: (bedSchedules?.schedules || []).map((it) => ({
      queryKey: ['seed', it.seed_id],
      queryFn: (args: QueryFunctionContext) => api.seeds.show(args.queryKey[1] as any),
      enabled: !!bedSchedules && planningPlantationModalOpen,
    })),
  })
  const seedsRequestsIsLoading = seedsRequests.some((it) => it.isLoading)

  if (groundRequest.isLoading) {
    // TODO: Extract to a component
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (groundRequest.isError) {
    // TODO: handle errors
    return <div>Erro ao carregar os dados do terreno</div>
  }

  return (
    <Box sx={{ px: 6 }}>
      <Header title={`Terrenos / ${ground!.description}`} links={['Home', 'Terrenos', 'Cadastrar']} />
      <Grid container spacing={2}>
        <Grid item md={12} lg={11} width="100%">
          <TerrainsGrid
            ground={ground!}
            onClickBed={(data) => {
              setSelectedBedData(data)
              switch (data.status) {
                case 'complete':
                  break
                case 'occupied':
                  setGroundBedInfoModalOpen(true)
                  break
                case 'free':
                  setGroundBedUpdateModalOpen(true)
                  break
              }
            }}
          />
        </Grid>
      </Grid>
      {selectedBedData && (
        <ModalGroundBedUpdate
          name={`Canteiro ${selectedBedData.bed.label}`}
          initialRepresentant={selectedBedData.responsible?.people_id || null}
          isAllocated={selectedBedData.bed.active}
          onClick={async (event) => {
            if (event === 'planning-plantation') {
              if (selectedBedData.bed.bed_schedules_id) {
                try {
                  const response = await api.bedSchedules.show(selectedBedData.bed.bed_schedules_id)
                  setBedSchedules(response.data)
                  setPlanningPlantationModalOpen(true)
                } catch (error) {
                  console.log(error)
                  // TODO: handle errors
                }
              } else {
                setPlanningPlantationModalOpen(true)
              }
            }
          }}
          onClose={async (event, values) => {
            switch (event) {
              case 'close':
                setGroundBedUpdateModalOpen(false)
                setSelectedBedData(null)
                break
              case 'submit': {
                if (!values) {
                  throw new Error('Invalid values')
                }

                const response = await api.voluntaries.storeMany(
                  values.voluntaries.map((it) => ({
                    bed_label: selectedBedData.bed.label,
                    ground_id: ground!.id,
                    people_id: it.key,
                    start_at: formatISODate(it.startDate),
                    is_responsible: it.key === values.representant,
                  })),
                )
                // TODO: handle errors
                response
                setGroundBedUpdateModalOpen(false)
                setSelectedBedData(null)
                break
              }
            }
          }}
          open={groundBedUpdateModalOpen}
          initialVoluntaries={selectedBedData.voluntaries.map((it) => ({
            key: it.people_id,
            value: it.people_name,
            startDate: new Date(it.start_at),
          }))}
        />
      )}
      {planningPlantationModalOpen && !seedsRequestsIsLoading && (
        <ModalPlanningPlantationRegister
          onClose={(event, values) => {
            switch (event) {
              case 'close':
                setPlanningPlantationModalOpen(false)
                break
              case 'submit': {
                if (!values) {
                  throw new Error('Invalid values')
                }
                setPlanningPlantationModalOpen(false)
                break
              }
            }
          }}
          open={planningPlantationModalOpen}
          defaultValues={(bedSchedules?.schedules || []).map((it, index) => ({
            startDate: new Date(it.start_at),
            endDate: new Date(it.end_at),
            plantation: seedsRequests[index].data?.data?.name || '',
          }))}
        />
      )}
      {groundBedInfoModalOpen && selectedBedData && (
        <ModalGroundBedInfo
          open={groundBedInfoModalOpen}
          onClose={(event) => {
            switch (event) {
              case 'close':
                setGroundBedInfoModalOpen(false)
                setSelectedBedData(null)
                break
              case 'edit':
                setGroundBedUpdateModalOpen(true)
                break
            }
          }}
          bedLabel={selectedBedData.bed.label}
          plantationType={selectedBedData.seed!.seed_type}
          responsible={selectedBedData.responsible!.people_name}
          responsiblePhotoSrc={undefined}
          startedAt={formatDate(new Date(selectedBedData.currentSchedule!.start_at))}
          voluntaries={selectedBedData.voluntaries.map((it) => it.people_name)}
        />
      )}
    </Box>
  )
}

type TerrainsGridProps = {
  ground: Ground
  onClickBed: (data: BedData) => void
}

function TerrainsGrid({ ground, onClickBed }: TerrainsGridProps) {
  const columns = Math.ceil(Math.sqrt(ground.beds.length))

  return (
    <Card variant="outlined" sx={{ width: '100%', maxHeight: '80vh' }}>
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
          {ground.beds.map((bed, index) => (
            <CardBed key={`bed-preview-${index}`} ground={ground} bed={bed} onClickBed={onClickBed} />
          ))}
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
        <Box display="flex">
          <Circle {...colors.free} />
          <Typography variant="caption" sx={{ alignSelf: 'center' }}>
            Disponível
          </Typography>
        </Box>
        <Box display="flex">
          <Circle {...colors.complete} />
          <Typography variant="caption" sx={{ alignSelf: 'center' }}>
            Prontos para colheita
          </Typography>
        </Box>
        <Box display="flex">
          <Circle {...colors.occupied} />
          <Typography variant="caption" sx={{ alignSelf: 'center' }}>
            Ocupado
          </Typography>
        </Box>
      </CardActions>
    </Card>
  )
}

type BedStatus = 'free' | 'occupied' | 'complete'
type BedData = {
  status: BedStatus
  bed: Bed
  currentSchedule?: BedSchedule
  voluntaries: Voluntary[]
  seed?: Seed
  responsible?: Voluntary
}

type CardBedProps = {
  ground: Ground
  bed: Bed
  onClickBed: (data: BedData) => void
}

const staleTime = 30 * 1000

function CardBed({ ground, bed, onClickBed }: CardBedProps) {
  // TODO: Update grounds.show to load all data at once
  const { data: seedRequest } = useQuery(
    ['seed', bed.seed_id || ''] as const,
    (args) => api.seeds.show(args.queryKey[1]),
    { enabled: !!bed.seed_id, staleTime },
  )
  const seed = seedRequest?.data
  const { data: voluntariesRequest } = useQuery(
    ['voluntaries', ground.id, bed.label] as const,
    (args) =>
      api.voluntaries.index({
        page: 1,
        page_size: 100,
        ground_id: args.queryKey[1],
        bed_label: args.queryKey[2],
      }),
    { staleTime },
  )
  const voluntaries = voluntariesRequest?.data.entities || []
  const responsible = voluntaries.find((it) => it.is_responsible)
  const bedSchedulesRequest = useQuery(
    ['bed-schedules', bed.bed_schedules_id || ''] as const,
    (args) => api.bedSchedules.show(args.queryKey[1]),
    { enabled: !!bed.bed_schedules_id },
  )
  const bedSchedules = bedSchedulesRequest.data?.data
  const currentSchedule = bedSchedules?.current_schedule
    ? bedSchedules.schedules[bedSchedules.current_schedule]
    : undefined
  const completed = !currentSchedule ? false : bed.seed_id !== currentSchedule.seed_id
  const period = currentSchedule
    ? `${formatDate(new Date(currentSchedule.start_at))} - ${formatDate(new Date(currentSchedule.end_at))}`
    : '...'
  const plant = seed?.name || '...'
  const user = responsible?.people_name || '...'
  const status = (completed ? 'complete' : bed.free ? 'free' : 'occupied') as BedStatus
  const data = { status, bed, voluntaries, seed, responsible, currentSchedule }

  if (completed) {
    return (
      <Box onClick={() => onClickBed(data)}>
        <CardBedComplete period={period} user={user} plant={plant} label={bed.label} />
      </Box>
    )
  } else if (bed.free) {
    return (
      <Box onClick={() => onClickBed(data)}>
        <CardBedFree label={bed.label} />
      </Box>
    )
  } else {
    return (
      <Box onClick={() => onClickBed(data)}>
        <CardBedOccupied label={bed.label} period={period} user={user} plant={plant} />
      </Box>
    )
  }
}

function Circle({ backgroundColor, borderColor }: typeof colors.occupied) {
  const size = '2.5rem'
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor,
        borderColor,
        borderStyle: 'solid',
        borderWidth: '2px',
        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
        mx: 1,
      }}
    />
  )
}
