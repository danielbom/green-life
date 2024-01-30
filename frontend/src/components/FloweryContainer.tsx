import { Box, BoxProps } from '@mui/material'
import bgImage1 from '../assets/images/bg-image-1.png'
import bgImage2 from '../assets/images/bg-image-2.png'
import bgImage3 from '../assets/images/bg-image-3.png'

export default function FancyContainer(props: BoxProps) {
  return (
    <Box
      {...props}
      sx={{
        background: (theme) =>
          [
            `url(${bgImage1}) right bottom no-repeat`,
            `url(${bgImage2}) -120px bottom no-repeat`,
            `url(${bgImage3}) center center no-repeat`,
            theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900],
          ].join(','),
        ...props.sx,
      }}
    />
  )
}
