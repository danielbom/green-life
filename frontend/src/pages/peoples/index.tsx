import { Box, Paper } from '@mui/material'
import { People } from './types'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import PeoplesTable from './PeoplesTable'
import Header from '../../components/Header'
import DialogAlertDelete from '../../components/DialogAlertDelete'
import ModalPeopleRegisterOrUpdate from '../../components/ModaPeopleRegisterOrUpdate'
import useLoadingAsync from '../../hooks/useLoadingAsync'
import { api } from '../../services/api'
import { removeEquals } from '../../utilities/removeEquals'

export function PeoplesPage() {
  const [selectedItem, setSelectedItem] = useState<People | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [isLoadingAsyncAction, wrapAsyncAction] = useLoadingAsync()
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [orderBy, setOrderBy] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [openRegisterOrEditModal, setOpenRegisterOrEditModal] = useState(false)
  const { data, isLoading, refetch } = useQuery(
    ['peoples', paginationModel.page, paginationModel.pageSize, orderBy, search],
    (args) => {
      return api.peoples.index({
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
      <Header title="Pessoa" links={['Home', 'Pessoa']} />
      <Paper sx={{ p: 2, display: 'flex', flex: 1, flexDirection: 'column', height: 750 }}>
        <PeoplesTable
          rows={data?.data.entities || []}
          onClickAdd={() => setOpenRegisterOrEditModal(true)}
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
                await api.peoples.delete(selectedItem.id)
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
      <ModalPeopleRegisterOrUpdate
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
                    email: selectedItem.email,
                    cellphone: selectedItem.cellphone,
                    birth_date: selectedItem.birth_date,
                    address: selectedItem.address,
                  }
                  const newItem = {
                    name: values.name,
                    email: values.email,
                    cellphone: values.cellphone,
                    birth_date: values.birth_date,
                    address: values.address,
                  }
                  await api.peoples.update(selectedItem.id, removeEquals(previousItem, newItem))
                  refetch()
                } catch (error) {
                  // TODO: show error
                  console.error(error)
                }
              } else {
                // create
                try {
                  await api.peoples.store({
                    name: values.name,
                    email: values.email,
                    cellphone: values.cellphone,
                    birth_date: values.birth_date,
                    address: values.address,
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
        initialValues={selectedItem || undefined}
      />
    </Box>
  )
}
