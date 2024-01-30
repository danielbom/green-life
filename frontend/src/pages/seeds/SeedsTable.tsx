import { DataGridProps, GridColDef } from '@mui/x-data-grid'
import DataGrid from '../../components/DataGrid'
import { ActionsButtonsProps } from '../../components/DataGrid/actionsButtons'
import { SeedView } from './types'
import { SeedOrderBy } from '../../services/api'

const typeMap: Record<SeedView['type'], string> = {
  fruit: 'Frutífera',
  vegetable: 'Hortaliça',
  herb: 'Erva',
  other: 'Outro',
}

type Column = Omit<GridColDef, 'field'> & { field: keyof SeedView }

const orderBy = {
  name_up: '⬆️ Nome',
  name_down: '⬇️ Nome',
} as Record<Exclude<SeedOrderBy, ''>, string>

const columns: Column[] = [
  { field: 'name', headerName: 'Nome', flex: 1 },
  { field: 'description', headerName: 'Descrição', flex: 2 },
  {
    field: 'type',
    headerName: 'Tipo',
    width: 100,
    align: 'center',
    valueFormatter: (params) => typeMap[params.value as SeedView['type']],
  },
  { field: 'amount', headerName: 'Quantidade', width: 100, type: 'number', align: 'center' },
]

type SeedsGridProps = ActionsButtonsProps<SeedView> & {
  rows: SeedView[]
  TableProps?: Omit<DataGridProps<SeedView>, 'rows' | 'columns'>
  onChangeOrderBy?: (orderBy: string | null) => void
  onChangeSearch?: (search: string) => void
}

export default function SeedsGrid({
  rows,
  onClickEdit,
  onClickDelete,
  TableProps,
  onChangeOrderBy,
  onChangeSearch,
}: SeedsGridProps) {
  return (
    <DataGrid.Container>
      <DataGrid.Toolbar>
        <DataGrid.Search sx={{ flex: 5 }} onTextChangeDebounced={onChangeSearch} />
        <DataGrid.OrderBy options={orderBy} onChangeOption={onChangeOrderBy} sx={{ flex: 2 }} />
      </DataGrid.Toolbar>
      <DataGrid.Table
        {...TableProps}
        columns={(columns as GridColDef[]).concat(DataGrid.actionsButtons<SeedView>({ onClickDelete, onClickEdit }))}
        rows={rows}
      />
    </DataGrid.Container>
  )
}
