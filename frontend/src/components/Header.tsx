import { Box, Breadcrumbs, Divider, Link, Typography } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'

type LinkOrValue = { label: string; href: string } | string
export type HeaderProps = {
  title: string
  links: LinkOrValue[]
}

export default function Header({ title, links }: HeaderProps) {
  return (
    <Box sx={sx.container}>
      <Typography variant="h4" fontWeight="500">
        {title}
      </Typography>
      <Divider />
      <Breadcrumbs aria-label="breadcrumb" separator={separator}>
        {links.map((link, index) => {
          const fontWeight = index === links.length - 1 ? 'bold' : undefined
          if (typeof link === 'string') {
            return (
              <Typography key={index} fontWeight={fontWeight}>
                {link}
              </Typography>
            )
          } else {
            return (
              <Link key={index} underline="hover" fontWeight={fontWeight} href={link.href}>
                {link.label}
              </Link>
            )
          }
        })}
      </Breadcrumbs>
    </Box>
  )
}

const sx = {
  container: {
    '& .MuiTypography-root': {
      color: 'primary.dark',
    },
    '& .MuiDivider-root': {
      pt: 1,
      color: 'primary.dark',
    },
    '& .MuiBreadcrumbs-root': {
      pb: 2,
    },
  },
}

const separator = <NavigateNextIcon fontSize="small" />
