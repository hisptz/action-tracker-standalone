import { useSearchParams } from 'react-router-dom'
import { useMemo } from 'react'

export function useMode () {
    const [searchParams] = useSearchParams()
    return useMemo(() => searchParams.get('type') as 'tracking' | 'planning', [searchParams])
}
