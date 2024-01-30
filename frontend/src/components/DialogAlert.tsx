import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import WarningIcon from '@mui/icons-material/Warning'
import { SxProps } from '@mui/material'

export type DialogAlertProps = {
  open: boolean
  onClose: (event: 'yes' | 'no') => void
  message: React.ReactNode
}

export default function DialogAlert({ open, onClose, message }: DialogAlertProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={sx.dialog}
    >
      <DialogTitle id="alert-dialog-title">
        <WarningIcon />
        Atenção
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose('no')} autoFocus>
          Não
        </Button>
        <Button onClick={() => onClose('yes')}>Sim</Button>
      </DialogActions>
    </Dialog>
  )
}

const sx = {
  dialog: {
    '& .MuiDialogTitle-root': {
      'display': 'flex',
      'alignItems': 'center',
      'justifyContent': 'center',
      'gap': 1,
      '& svg': {
        color: 'yellow',
        fontSize: '2.5rem',
      },
    },
    '& .MuiDialogContent-root': {
      maxWidth: '400px',
      minWidth: '300px',
      textAlign: 'center',
    },
    '& .MuiDialogActions-root': {
      display: 'flex',
      gap: 2,
      justifyContent: 'center',
    },
  } as SxProps,
}
