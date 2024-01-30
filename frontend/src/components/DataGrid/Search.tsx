import { TextField, InputAdornment, IconButton, TextFieldProps } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useRef } from 'react'

type SearchProps = TextFieldProps & {
  onTextChangeDebounced?: (text: string) => void
  debounceTime?: number
}

// TODO: Update on enter or click in search button
export function Search({ sx: sxOut, InputProps, debounceTime = 1000, onTextChangeDebounced, ...props }: SearchProps) {
  const ref = useRef<number>()

  return (
    <TextField
      {...props}
      label="Pesquisar"
      fullWidth
      sx={{ ...sxOut, ...sx.textField }}
      onChange={(event) => {
        clearTimeout(ref.current)
        ref.current = setTimeout(() => {
          onTextChangeDebounced?.(event.target.value)
        }, debounceTime)
        props.onChange?.(event)
      }}
      InputProps={{
        ...InputProps,
        endAdornment: (
          <InputAdornment position="end">
            <IconButton>
              <SearchIcon sx={{ color: 'primary.main' }} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  )
}

export const sx = {
  textField: {
    '& label.Mui-focused': {
      color: 'primary.main',
    },
    '& .MuiInput-underline:after': {
      borderColor: 'primary.main',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'primary.main',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
      },
    },
  },
}
