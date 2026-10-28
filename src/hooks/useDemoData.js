import { useContext, useSyncExternalStore } from 'react'
import { authContext } from '../context/authContext.js'
import { demoStore } from '../data/demoStore.js'

const emptySnapshot = () => null

export function useDemoData() {
    const { isDemo } = useContext(authContext)
    return useSyncExternalStore(demoStore.subscribe, isDemo ? demoStore.getSnapshot : emptySnapshot)
}
