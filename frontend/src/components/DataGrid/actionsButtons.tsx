import { GridColDef, GridRenderCellParams, GridValidRowModel } from '@mui/x-data-grid'
import { Box, Button, SxProps } from '@mui/material'
import { sx as sxIconButton } from '../AddIconButton'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

export type ActionsButtonsProps<T extends GridValidRowModel> = {
  onClickShow?: (params: GridRenderCellParams<T>) => void
  onClickEdit?: (params: GridRenderCellParams<T>) => void
  onClickDelete?: (params: GridRenderCellParams<T>) => void
}

export function actionsButtons<T extends GridValidRowModel>({
  onClickShow,
  onClickEdit,
  onClickDelete,
}: ActionsButtonsProps<T>): GridColDef<T> {
  if (!onClickDelete && !onClickEdit && !onClickShow) {
    throw new Error('onClickDelete or onClickEdit or onClickShow is required')
  }

  const width = 65 * ((onClickDelete ? 1 : 0) + (onClickEdit ? 1 : 0) + (onClickShow ? 1 : 0))

  return {
    field: 'Ações',
    align: 'center',
    headerAlign: 'center',
    width,
    disableReorder: true,
    disableColumnMenu: true,
    renderCell: (param) => {
      return (
        <Box sx={sx.container}>
          {onClickDelete && (
            <Box sx={sxIconButton.container}>
              <Button onClick={() => onClickDelete(param)} variant="outlined" color="error">
                <DeleteIcon />
              </Button>
            </Box>
          )}
          {onClickEdit && (
            <Box sx={sxIconButton.container}>
              <Button onClick={() => onClickEdit(param)} variant="outlined" color="info">
                <EditIcon />
              </Button>
            </Box>
          )}
          {onClickShow && (
            <Box sx={sxIconButton.container}>
              <Button onClick={() => onClickShow(param)} variant="outlined" color="info">
                <ArrowForwardIcon />
              </Button>
            </Box>
          )}
        </Box>
      )
    },
  }
}

const sx = {
  container: {
    display: 'flex',
    gap: 2,
  } as SxProps,
}
