import { Alert } from '@mui/material'

const Error = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <Alert style={{ marginTop: 10, marginBottom: 10 }} severity='error'>
      {message}
    </Alert>
  )
}

export default Error