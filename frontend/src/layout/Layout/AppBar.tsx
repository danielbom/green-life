import { useQuery } from '@tanstack/react-query'

import { Paper, MenuList, MenuItem, ListItemIcon, ListItemText, Divider, Menu } from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useState } from 'react'
import { api } from '../../services/api'

type AppBarProps = {
  onClickMenu: (event: 'user' | 'exit') => void
}

export default function MainAppBar({ onClickMenu }: AppBarProps) {
  const [userAnchor, setUserAnchor] = useState<null | HTMLElement>(null)
  const { data } = useQuery(['auth', 'me'], () => api.auth.me())
  const user = data?.data

  return (
    <Box component="header" zIndex={1} width="100%">
      <Toolbar
        sx={{
          pr: '24px', // keep right padding when drawer closed
        }}
      >
        <Typography component="h2" color="inherit" noWrap sx={{ flexGrow: 1 }}>
          Bem-Vindo {user?.name ?? '#'}
        </Typography>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Box pr={2} />
        <IconButton color="inherit" onClick={(e) => setUserAnchor(e.currentTarget)}>
          <Avatar alt={user?.name ?? '#'} src="#" sx={{ width: 56, height: 56 }} />
        </IconButton>
      </Toolbar>
      <UserMenu
        open={!!userAnchor}
        anchorEl={userAnchor}
        onClose={() => setUserAnchor(null)}
        onClick={(event) => {
          onClickMenu(event)
          setUserAnchor(null)
        }}
      />
    </Box>
  )
}

type UserMenuProps = {
  anchorEl: HTMLElement | null
  open: boolean
  onClose: () => void
  onClick: (event: 'user' | 'exit') => void
}

function UserMenu({ anchorEl, open, onClose, onClick }: UserMenuProps) {
  return (
    <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      MenuListProps={{ 'aria-labelledby': 'basic-button' }}
    >
      <Paper sx={{ width: 320 }}>
        <MenuList>
          <MenuItem onClick={() => onClick('user')}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Perfil</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => onClick('exit')}>
            <ListItemIcon>
              <ExitToAppIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Sair</ListItemText>
          </MenuItem>
        </MenuList>
      </Paper>
    </Menu>
  )
}
