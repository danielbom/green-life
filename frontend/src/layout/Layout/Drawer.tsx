import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ConstructionIcon from '@mui/icons-material/Construction'
import LocalFloristIcon from '@mui/icons-material/LocalFlorist'
import HomeIcon from '@mui/icons-material/Home'
import LayersIcon from '@mui/icons-material/Layers'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleIcon from '@mui/icons-material/People'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import MuiDrawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import IconListItem from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

import logo from '../../assets/images/logo.png'
import List, { ListProps } from '@mui/material/List'
import React from 'react'

export const drawerWidthClose: number = 64
export const drawerWidthOpen: number = 240

const items: Item[] = [
  {
    id: 'home',
    label: 'Home',
    icon: <HomeIcon />,
  },
  {
    id: 'peoples',
    label: 'Pessoas',
    icon: <PeopleIcon />,
  },
  {
    id: 'terrains',
    label: 'Terrenos',
    icon: <LayersIcon />,
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    icon: <ConstructionIcon />,
  },
  {
    id: 'seeds',
    label: 'Sementes',
    icon: <LocalFloristIcon />,
  },
]

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  '& .MuiDrawer-paper': {
    position: 'relative',
    whiteSpace: 'nowrap',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    boxSizing: 'border-box',
    overflowX: 'hidden',
    ...(!open
      ? {
          width: drawerWidthClose,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }
      : {
          width: drawerWidthOpen,
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }),
  },
}))

type MainDrawerProps = {
  open: boolean
  toggleDrawer: () => void
  activeItem: ItemId
  onClickItem: (item: ItemId) => void
}

const NavDrawerList = (props: ListProps) => <List component="nav" {...props} />
const DrawerList = styled(NavDrawerList)<ListProps>(({ theme }) => ({
  'color': 'white',
  '& .MuiListItemButton-root': {
    padding: theme.spacing(2),
  },
  '& svg': {
    color: 'white',
  },
  '& .active:hover': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[900],
  },
  '& .active': {
    backgroundColor: theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
    color: '#014023',
  },
  '& .active svg': {
    color: theme.palette.primary.dark,
  },
}))

export default function MainDrawer({ open, toggleDrawer, activeItem, onClickItem }: MainDrawerProps) {
  const buttonProps = (itemId: ItemId) => ({
    className: activeItem === itemId ? 'active' : '',
    onClick: () => onClickItem(itemId),
  })
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
          height: '80px',
        }}
      >
        {open ? (
          <>
            <Box py={0.5}>
              <img src={logo} alt="Green Life logo" style={{ width: '60px' }} />
            </Box>
            <Typography component="h1" fontSize="22px" mr="auto" fontWeight="semi-bold">
              Overview
            </Typography>
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon sx={{ color: 'white' }} />
            </IconButton>
          </>
        ) : (
          <Box mx="auto">
            <IconButton color="inherit" aria-label="open drawer" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>
        )}
      </Toolbar>
      <Divider />
      <DrawerList>
        {items.map((item) => (
          <React.Fragment key={item.id}>
            <ListItemButton {...buttonProps(item.id)}>
              <IconListItem>{item.icon}</IconListItem>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </React.Fragment>
        ))}
      </DrawerList>
    </Drawer>
  )
}

export type ItemId = 'home' | 'peoples' | 'terrains' | 'tools' | 'seeds'
export type Item = {
  id: ItemId
  label: string
  icon: React.ReactNode
}

export function getItem(itemId: ItemId): Item {
  return items.find((it) => it.id === itemId)!
}
