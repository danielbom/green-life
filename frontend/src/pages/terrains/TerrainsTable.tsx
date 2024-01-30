import { DataGridProps, GridColDef } from '@mui/x-data-grid'
import DataGrid from '../../components/DataGrid'
import { ActionsButtonsProps } from '../../components/DataGrid/actionsButtons'
import { TerrainView } from './types'
import { GroundOrderBy } from '../../services/api'

type Column = Omit<GridColDef, 'field'> & { field: keyof TerrainView }

const orderBy = {
  address_up: '⬆️ Endereço',
  address_down: '⬇️ Endereço',
} as Record<Exclude<GroundOrderBy, ''>, string>

const columns: Column[] = [
  { field: 'address', headerName: 'Endereço', flex: 1 },
  { field: 'width', headerName: 'Largura', width: 100, type: 'number', align: 'center', headerAlign: 'center' },
  { field: 'length', headerName: 'Comprimento', width: 120, type: 'number', align: 'center', headerAlign: 'center' },
]

type TerrainsTableProps = ActionsButtonsProps<TerrainView> & {
  rows: TerrainView[]
  TableProps?: Omit<DataGridProps<TerrainView>, 'rows' | 'columns'>
  onChangeOrderBy?: (orderBy: string | null) => void
  onChangeSearch?: (search: string) => void
}

export default function TerrainsTable({
  rows,
  onClickShow,
  onClickDelete,
  TableProps,
  onChangeOrderBy,
  onChangeSearch,
}: TerrainsTableProps) {
  return (
    <DataGrid.Container>
      <DataGrid.Toolbar>
        <DataGrid.Search sx={{ flex: 5 }} onTextChangeDebounced={onChangeSearch} />
        <DataGrid.OrderBy options={orderBy} onChangeOption={onChangeOrderBy} sx={{ flex: 2 }} />
      </DataGrid.Toolbar>
      <DataGrid.Table
        {...TableProps}
        columns={(columns as GridColDef[]).concat(DataGrid.actionsButtons<TerrainView>({ onClickDelete, onClickShow }))}
        rows={rows}
      />
    </DataGrid.Container>
  )
}
