import { useMemo } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import { SxProps } from '@mui/material'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'

export type ModalRegisterProps = {
  title: string
  open: boolean
  onClose: (action: 'close' | 'submit') => void
  children?: React.ReactNode
  actions?: React.ReactNode
  sx?: Partial<typeof sx>
  minWidth?: string
}

export default function ModalRegister({
  minWidth = '400px',
  title,
  open,
  onClose,
  children,
  actions,
  sx: sxOut,
}: ModalRegisterProps) {
  const sx = useMemo(() => {
    if (!sxOut) return _sx
    const entries = Object.entries(_sx).map(([key, value]) => [key, { ...value, ...(sxOut as any)[key] }])
    return Object.fromEntries(entries)
  }, [sxOut])
  return (
    <Modal
      open={open}
      onClose={() => onClose('close')}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Card variant="outlined" sx={sx.card}>
        <CardHeader
          title={title}
          action={
            <IconButton color="primary" onClick={() => onClose('close')}>
              <CloseIcon />
            </IconButton>
          }
        />
        <Divider />
        <CardContent sx={{ minWidth, ...sx.content }}>{children}</CardContent>
        <Divider />
        <CardActions sx={sx.actions}>
          {actions || (
            <Button type="submit" variant="contained" onClick={() => onClose('submit')}>
              Salvar
            </Button>
          )}
        </CardActions>
      </Card>
    </Modal>
  )
}

export const sx = {
  card: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    py: 2,
    px: 2.5,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  } as SxProps,
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  } as SxProps,
  row: {
    display: 'flex',
    gap: 2,
  } as SxProps,
  actions: {
    display: 'flex',
    justifyContent: 'center',
    py: 2,
  } as SxProps,
  error: {
    color: 'error.main',
  } as SxProps,
}
const _sx = sx
