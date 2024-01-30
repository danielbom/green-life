import { useRef, useState, useEffect } from 'react'

export default function useLoadingAsync() {
  const mounted = useRef(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  async function wrapAsync<F extends () => any>(callback: F) {
    if (!mounted.current) return
    if (isLoading) return
    setIsLoading(true)
    await callback().finally(() => setIsLoading(false))
  }

  return [isLoading, wrapAsync] as const
}
