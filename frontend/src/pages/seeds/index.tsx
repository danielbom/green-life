import { Grid, Paper, Box, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import DialogAlertDelete from '../../components/DialogAlertDelete'
import Statistics from '../../components/Statistics'
import Header from '../../components/Header'
import SeedsTable from './SeedsTable'
import ModalSeedRegisterOrUpdate from '../../components/ModalSeedRegisterOrUpdate'
import { SeedView } from './types'
import { api } from '../../services/api'
import { removeEquals } from '../../utilities/removeEquals'
import useLoadingAsync from '../../hooks/useLoadingAsync'

export function SeedsPage() {
  const [selectedItem, setSelectedItem] = useState<SeedView | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openRegisterOrEditModal, setOpenRegisterOrEditModal] = useState(false)
  const [isLoadingAsyncAction, wrapAsyncAction] = useLoadingAsync()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [orderBy, setOrderBy] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const { data, isLoading, refetch } = useQuery(
    ['seeds', paginationModel.page, paginationModel.pageSize, orderBy, search],
    (args) => {
      return api.seeds.index({
        page: Number(args.queryKey[1]) + 1,
        page_size: Number(args.queryKey[2]),
        order_by: (args.queryKey[3] as any) || '',
        search: (args.queryKey[4] as string) || '',
      })
    },
  )
  const loading = isLoadingAsyncAction || isLoading
  const rowCount = data?.data.row_count || 0

  return (
    <Box sx={{ px: 6 }}>
      <Header title="Sementes" links={['Home', 'Sementes']} />
      <Grid container>
        <Grid item xs={12} md={8} lg={9} sx={{ paddingRight: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flex: 1, flexDirection: 'column', height: 750 }}>
            <SeedsTable
              rows={(data?.data.entities || []).map((it) => ({
                id: it.id,
                name: it.name,
                amount: it.amount,
                description: '',
                type: it.seed_type,
              }))}
              onClickDelete={(params) => {
                setSelectedItem(params.row)
                setOpenDeleteDialog(true)
              }}
              onClickEdit={(params) => {
                setSelectedItem(params.row)
                setOpenRegisterOrEditModal(true)
              }}
              onChangeOrderBy={setOrderBy}
              onChangeSearch={setSearch}
              TableProps={{
                paginationMode: 'server',
                loading,
                paginationModel,
                rowCount,
                onPaginationModelChange: (model) => setPaginationModel((it) => ({ ...it, ...model })),
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Box p={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                setSelectedItem(null)
                setOpenRegisterOrEditModal(true)
              }}
            >
              Registrar Semente
            </Button>
          </Box>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(750px - 69px)',
            }}
          >
            <Statistics />
          </Paper>
        </Grid>
      </Grid>
      <DialogAlertDelete
        open={openDeleteDialog}
        onClose={(event) =>
          wrapAsyncAction(async () => {
            if (!selectedItem) {
              throw new Error('selectedItem is null')
            }
            setOpenDeleteDialog(false)
            if (event === 'yes') {
              try {
                await api.seeds.delete(selectedItem.id)
                refetch()
              } catch (error) {
                // TODO: show error
                console.error(error)
              }
            }
            setSelectedItem(null)
          })
        }
      />
      <ModalSeedRegisterOrUpdate
        open={openRegisterOrEditModal}
        onClose={(event, values) =>
          wrapAsyncAction(async () => {
            if (event === 'close') {
              setSelectedItem(null)
              setOpenRegisterOrEditModal(false)
              return
            }
            if (!values) {
              throw new Error('values is null')
            }

            setOpenRegisterOrEditModal(false)
            if (event === 'submit') {
              if (selectedItem) {
                // update
                try {
                  const previousItem = {
                    name: selectedItem.name,
                    amount: selectedItem.amount,
                    seed_type: selectedItem.type as any,
                    description: selectedItem.description,
                  }
                  const newItem = {
                    name: values.name,
                    amount: values.amount,
                    seed_type: values.type as any,
                    description: values.description,
                  }
                  await api.seeds.update(selectedItem.id, removeEquals(previousItem, newItem))
                  refetch()
                } catch (error) {
                  // TODO: show error
                  console.error(error)
                }
              } else {
                // create
                try {
                  await api.seeds.store({
                    name: values.name,
                    amount: values.amount,
                    seed_type: values.type as any,
                    description: values.description || '',
                  })
                  refetch()
                } catch (error) {
                  // TODO: show error
                  console.error(error)
                }
              }
            }
            setSelectedItem(null)
          })
        }
        initialValues={selectedItem}
      />
    </Box>
  )
}
