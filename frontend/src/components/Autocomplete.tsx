import {
  CircularProgress,
  Autocomplete as MuiAutocomplete,
  AutocompleteProps as MuiAutocompleteProps,
  TextField,
  TextFieldProps,
} from '@mui/material'

type MuiAutocompleteTyped = MuiAutocompleteProps<Option, false, false, false>

export type Option = { key: string; value: string }
export type AutocompleteProps = {
  id: string
  value: Option | null
  options: Option[]
  alreadyAdded?: Option[]
  onChange: MuiAutocompleteTyped['onChange']
  loading: boolean
  noOptionsText: string
  TextFieldProps: TextFieldProps
  error: boolean
  sx?: MuiAutocompleteTyped['sx']
}

export function Autocomplete({
  id,
  value,
  options,
  alreadyAdded = [],
  onChange,
  loading,
  noOptionsText,
  TextFieldProps,
  error,
  sx,
}: AutocompleteProps) {
  return (
    <MuiAutocomplete
      disablePortal
      id={id}
      clearOnBlur
      value={value}
      options={options}
      getOptionDisabled={(option) => option.key === value?.key || alreadyAdded.some((it) => it.key === option.key)}
      getOptionLabel={(option) => option.value}
      isOptionEqualToValue={(option, value) => option.key === value.key}
      onChange={onChange}
      loading={loading}
      noOptionsText={noOptionsText}
      sx={sx}
      renderInput={(params) => (
        <TextField
          {...params}
          {...TextFieldProps}
          fullWidth
          variant="outlined"
          error={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
