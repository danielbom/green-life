import { Grid, Paper, Box, Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import DialogAlertDelete from '../../components/DialogAlertDelete'
import Header from '../../components/Header'
import TerrainsTable from './TerrainsTable'
import Statistics from '../../components/Statistics'
import { TerrainView } from './types'
import { api } from '../../services/api'
import useLoadingAsync from '../../hooks/useLoadingAsync'
import { useNavigate } from 'react-router-dom'
import { paths } from '../../Router'

export function TerrainsPage() {
  const navigate = useNavigate()
  const [selectedItem, setSelectedItem] = useState<TerrainView | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [isLoadingAsyncAction, wrapAsyncAction] = useLoadingAsync()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [orderBy, setOrderBy] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const { data, isLoading, refetch } = useQuery(
    ['terrains', paginationModel.page, paginationModel.pageSize, orderBy, search],
    (args) => {
      return api.grounds.index({
        page: Number(args.queryKey[1]) + 1,
        page_size: Number(args.queryKey[2]),
        order_by: (args.queryKey[3] as any) || '',
        search: (args.queryKey[4] as string) || '',
      })
    },
  )
  const loading = isLoadingAsyncAction || isLoading
  const rowCount = data?.data.row_count || 0

  // TODO: Create a layout to show table + statistics
  return (
    <Box sx={{ px: 6 }}>
      <Header title="Terrenos" links={['Home', 'Terrenos']} />
      <Grid container>
        {/* Recent Orders */}
        <Grid item xs={12} md={8} lg={9} sx={{ paddingRight: 2 }}>
          <Paper sx={{ p: 2, display: 'flex', flex: 1, flexDirection: 'column', height: 750 }}>
            <TerrainsTable
              rows={data?.data.entities || []}
              onClickDelete={(params) => {
                setSelectedItem(params.row)
                setOpenDeleteDialog(true)
              }}
              onClickShow={(params) => {
                navigate(paths.terrainsShow.replace(':id', params.row.id.toString()))
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
        {/* Recent Deposits */}
        <Grid item xs={12} md={4} lg={3}>
          <Box p={2}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => {
                navigate(paths.terrainsRegister)
              }}
            >
              Registrar Terreno
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
                await api.grounds.delete(selectedItem.id)
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
    </Box>
  )
}
