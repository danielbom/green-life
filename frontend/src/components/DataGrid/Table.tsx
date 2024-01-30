import { DataGrid as MuiDataGrid, DataGridProps, GridValidRowModel } from '@mui/x-data-grid'

export function Table<T extends GridValidRowModel>({ sx, columns, ...props }: DataGridProps<T>) {
  return (
    <MuiDataGrid
      disableRowSelectionOnClick
      disableColumnSelector
      disableColumnFilter
      disableColumnMenu
      disableDensitySelector
      checkboxSelection={false}
      pagination
      paginationMode="client"
      columns={columns.map((it) => ({ ...it, sortable: false }))}
      sx={{
        ...sx,
        borderColor: 'primary.main',
      }}
      initialState={{
        pagination: {
          paginationModel: {
            page: 0,
            pageSize: 10,
          },
        },
      }}
      pageSizeOptions={[5, 10, 20, 50, 100]}
      {...props}
    />
  )
}
