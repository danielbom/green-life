import {
  Modal,
  Card,
  Divider,
  CardContent,
  CardActions,
  Button,
  CardMedia,
  Typography,
  Avatar,
  Stack,
  Box,
  List,
  ListItem,
  ListItemText,
  CardHeader,
} from '@mui/material'
import bedHeader from '../assets/images/bed-header.png'
import EditIcon from '@mui/icons-material/Edit'

type ModalGroundBedInfoEvents = 'close' | 'edit'

type ModalGroundBedInfoProps = {
  open: boolean
  onClose: (action: ModalGroundBedInfoEvents) => void
  bedLabel: string
  responsible: string
  responsiblePhotoSrc?: string
  startedAt: string
  plantationType: string
  voluntaries: string[]
}

export default function ModalGroundBedInfo({
  open,
  onClose,
  responsiblePhotoSrc, // 'https://i.pravatar.cc/300'
  bedLabel,
  responsible = 'Example 123',
  startedAt = '07/01/2023',
  plantationType = 'Vegerais',
  voluntaries = ['Magnus Calsen', 'João da Silva', 'Maria de Souza'],
}: ModalGroundBedInfoProps) {
  const headerWidth = 340
  const headerHeight = 120
  const avatarSize = 160
  const fontSize = '1rem'
  const lineHeight = 1.75
  return (
    <Modal
      open={open}
      onClose={() => onClose('close')}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Stack alignItems="center">
        <Avatar
          alt="Responsible photo"
          variant="circular"
          sx={{
            width: avatarSize,
            height: avatarSize,
            borderColor: 'primary.main',
            borderWidth: 2,
            borderStyle: 'solid',
            marginBottom: `-${avatarSize / 2}px`,
            zIndex: 1,
          }}
          src={responsiblePhotoSrc}
        />
        <Card
          variant="outlined"
          sx={{ borderColor: 'primary.main', borderWidth: 2, position: 'relative', borderRadius: 2 }}
        >
          <CardMedia sx={{ width: headerWidth, height: headerHeight }} image={bedHeader} title="Header image" />
          <CardHeader title={`Lote ${bedLabel}`} sx={{ textAlign: 'center' }} />
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}>
              <Typography variant="h5" component="div" color="text.secondary" sx={{ fontSize, lineHeight }}>
                Responsável:
              </Typography>
              <Typography variant="body2" color="primary.dark" sx={{ fontSize, lineHeight }}>
                {responsible}
              </Typography>
              <Typography variant="h5" component="div" color="text.secondary" sx={{ fontSize, lineHeight }}>
                Iniciado em:
              </Typography>
              <Typography variant="body2" color="primary.dark" sx={{ fontSize, lineHeight }}>
                {startedAt}
              </Typography>
              <Typography variant="h5" component="div" color="text.secondary" sx={{ fontSize, lineHeight }}>
                Tipo de platação:
              </Typography>
              <Typography variant="body2" color="primary.dark" sx={{ fontSize, lineHeight }}>
                {plantationType}
              </Typography>
              <Typography variant="h5" component="div" color="text.secondary" sx={{ fontSize, lineHeight }}>
                Voluntários:
              </Typography>
            </Box>
            <List sx={{ overflow: 'auto', height: '100%', maxHeight: 120, minHeight: 150 }}>
              {voluntaries.map((voluntary, index) => (
                <ListItem key={`bed-voluntary-${index}`} sx={{ py: 0 }}>
                  <Box
                    component="span"
                    sx={{ marginRight: '0.5rem', fontSize: '1.5rem', lineHeight: '1rem', color: 'primary.dark' }}
                  >
                    &bull;
                  </Box>
                  <ListItemText primary={voluntary} sx={{ color: 'primary.dark' }} />
                </ListItem>
              ))}
            </List>
          </CardContent>
          <Divider />
          <CardActions
            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 2, gap: 1, px: '20%' }}
          >
            <Button
              type="submit"
              variant="outlined"
              color="info"
              sx={{ width: '100%', pl: 4 }}
              endIcon={<EditIcon sx={{ ml: '100%' }} />}
              onClick={() => onClose('edit')}
            >
              Editar
            </Button>
            <Box sx={{ width: '100%' }}>
              {/* The box was necessary to remove margin left from buttons */}
              <Button
                type="submit"
                variant="outlined"
                color="error"
                sx={{ width: '100%' }}
                onClick={() => onClose('close')}
              >
                Fechar
              </Button>
            </Box>
          </CardActions>
        </Card>
      </Stack>
    </Modal>
  )
}
