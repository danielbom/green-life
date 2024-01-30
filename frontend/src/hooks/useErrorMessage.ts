import { useEffect, useRef, useState } from 'react'

export default function useErrorMessage(timeout = 5000) {
  const mounted = useRef(false)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  useEffect(() => {
    if (error) {
      const id = setTimeout(() => {
        if (mounted.current) {
          setError(undefined)
        }
      }, timeout)
      return () => clearTimeout(id)
    }
  }, [error])

  return [error, setError] as const
}
