import { useEffect, useState } from 'react'

// Callers memoize load; ignore stale results after navigation or a mode change.
export function useResource(load) {
    const [result, setResult] = useState({ data: null, error: '', isLoading: true })
    useEffect(() => {
        let active = true
        load().then(data => {
            if (active) setResult({ load, data, error: '', isLoading: false })
        }).catch(error => {
            if (active) setResult({ load, data: null, error: error.response?.data?.message || error.message, isLoading: false })
        })
        return () => { active = false }
    }, [load])
    return result.load === load ? result : { data: null, error: '', isLoading: true }
}
