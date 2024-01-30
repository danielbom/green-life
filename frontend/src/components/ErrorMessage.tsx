import { Box, styled } from '@mui/material'
import { FieldError } from 'react-hook-form'

type ErrorMessageProps = {
  errors: (FieldError | undefined)[]
}

export default function ErrorMessage({ errors }: ErrorMessageProps) {
  const error = errors.filter((it) => !!it)[0]

  if (!error) return null
  return <ErrorMessageBox>{error.message!.toString()}</ErrorMessageBox>
}

export const ErrorMessageBox = styled(Box)(({ theme }) => ({
  color: theme.palette.error.main,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  p: theme.spacing(1),
}))
