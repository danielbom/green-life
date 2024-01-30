import { IconButton, InputAdornment, MenuItem, TextField, TextFieldProps } from '@mui/material'
import DeleteIcon from '@mui/icons-material/ClearRounded'
import { useState } from 'react'
import { sx as sxInputSearch } from './Search'

type Key = string
type Value = string

type OrderByProps = TextFieldProps & {
  options: Record<Key, Value>
  onChangeOption?: (option: string | null) => void
}

export function OrderBy({ options, onChangeOption, InputProps, ...props }: OrderByProps) {
  const [value, _setValue] = useState<string>('')

  function setValue(value: string) {
    _setValue(value)
    onChangeOption?.(value || null)
  }

  return (
    <TextField
      {...props}
      sx={{ ...sxInputSearch.textField, ...props.sx }}
      select
      label="Ordenar por"
      value={value}
      onChange={(event) => {
        setValue(event.target.value)
        props.onChange?.(event)
      }}
      InputProps={{
        ...InputProps,
        endAdornment: value && value.length > 0 && (
          <InputAdornment position="start">
            <IconButton onClick={() => setValue('')}>
              <DeleteIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    >
      {Object.entries(options).map(([key, value], index) => (
        <MenuItem key={`order-by-${index}-${key}`} value={key}>
          {value}
        </MenuItem>
      ))}
    </TextField>
  )
}
