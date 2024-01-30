import Box from '@mui/material/Box'
import { useState } from 'react'

import FloweryContainer from '../../components/FloweryContainer'
import MainDrawer, { Item, ItemId, getItem } from './Drawer'
import MainAppBar from './AppBar'

type LayoutProps = {
  children: React.ReactNode
  activeItem?: ItemId
  onClickItem?: (item: Item) => void
  onClickMenu: (event: 'user' | 'exit') => void
}

export function Layout({ children, onClickItem = () => {}, activeItem = 'home', onClickMenu }: LayoutProps) {
  const [open, setOpen] = useState(false)
  const toggleDrawer = () => setOpen((it) => !it)

  return (
    <Box sx={{ display: 'flex' }}>
      <MainDrawer
        open={open}
        toggleDrawer={toggleDrawer}
        activeItem={activeItem}
        onClickItem={(itemId) => onClickItem(getItem(itemId))}
      />
      <FloweryContainer
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <MainAppBar onClickMenu={onClickMenu} />
        {children}
      </FloweryContainer>
    </Box>
  )
}
