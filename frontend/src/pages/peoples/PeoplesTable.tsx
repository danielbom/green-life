import { DataGridProps, GridColDef } from '@mui/x-data-grid'
import DataGrid from '../../components/DataGrid'
import { ActionsButtonsProps } from '../../components/DataGrid/actionsButtons'
import { People } from './types'
import { PeopleOrderBy } from '../../services/api'

type Column = Omit<GridColDef, 'field'> & { field: keyof People }

const orderBy = {
  name_up: '⬆️ Nome',
  name_down: '⬇️ Nome',
  birth_date_up: '⬆️ Data de nascimento',
  birth_date_down: '⬇️ Data de nascimento',
  address_up: '⬆️ Endereço',
  address_down: '⬇️ Endereço',
} as Record<Exclude<PeopleOrderBy, ''>, string>

const columns: Column[] = [
  { field: 'name', headerName: 'Nome', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 2 },
  { field: 'cellphone', headerName: 'Celular', width: 150 },
  { field: 'birth_date', headerName: 'Data de nascimento', width: 150, align: 'center' },
  { field: 'address', headerName: 'Endereço', flex: 2 },
]

type PeoplesTableProps = ActionsButtonsProps<People> & {
  rows: People[]
  TableProps?: Omit<DataGridProps<People>, 'rows' | 'columns'>
  onClickAdd: () => void
  onChangeOrderBy?: (orderBy: string | null) => void
  onChangeSearch?: (search: string) => void
}

export default function PeoplesTable({
  rows,
  onChangeOrderBy,
  onChangeSearch,
  onClickEdit,
  onClickDelete,
  onClickAdd,
  TableProps,
}: PeoplesTableProps) {
  return (
    <DataGrid.Container>
      <DataGrid.Toolbar>
        <DataGrid.Search sx={{ flex: 5 }} onTextChangeDebounced={onChangeSearch} />
        <DataGrid.OrderBy options={orderBy} sx={{ flex: 2 }} onChangeOption={onChangeOrderBy} />
        <DataGrid.AddButton onClick={onClickAdd} />
      </DataGrid.Toolbar>
      <DataGrid.Table
        {...TableProps}
        columns={(columns as GridColDef[]).concat(DataGrid.actionsButtons<People>({ onClickDelete, onClickEdit }))}
        rows={rows}
      />
    </DataGrid.Container>
  )
}
