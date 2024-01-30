import { DataGridProps, GridColDef } from '@mui/x-data-grid'
import DataGrid from '../../components/DataGrid'
import { ActionsButtonsProps } from '../../components/DataGrid/actionsButtons'
import { ToolView } from './types'
import { ToolOrderBy } from '../../services/api'

type Column = Omit<GridColDef, 'field'> & { field: keyof ToolView }

const orderBy = {
  name_up: '⬆️ Nome',
  name_down: '⬇️ Nome',
} as Record<Exclude<ToolOrderBy, ''>, string>

const columns: Column[] = [
  { field: 'name', headerName: 'Nome', flex: 1 },
  { field: 'description', headerName: 'Descrição', flex: 2 },
  { field: 'amount', headerName: 'Quantidade', width: 100, type: 'number', align: 'center' },
]

type TerrainsGridProps = ActionsButtonsProps<ToolView> & {
  rows: ToolView[]
  TableProps?: Omit<DataGridProps<ToolView>, 'rows' | 'columns'>
  onChangeOrderBy?: (orderBy: string | null) => void
  onChangeSearch?: (search: string) => void
}

export default function TerrainsGrid({
  rows,
  onClickEdit,
  onClickDelete,
  TableProps,
  onChangeOrderBy,
  onChangeSearch,
}: TerrainsGridProps) {
  return (
    <DataGrid.Container>
      <DataGrid.Toolbar>
        <DataGrid.Search sx={{ flex: 5 }} onTextChangeDebounced={onChangeSearch} />
        <DataGrid.OrderBy options={orderBy} onChangeOption={onChangeOrderBy} sx={{ flex: 2 }} />
      </DataGrid.Toolbar>
      <DataGrid.Table
        {...TableProps}
        columns={(columns as GridColDef[]).concat(DataGrid.actionsButtons<ToolView>({ onClickDelete, onClickEdit }))}
        rows={rows}
      />
    </DataGrid.Container>
  )
}
