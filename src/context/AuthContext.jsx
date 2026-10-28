import { useSyncExternalStore } from 'react'
import { authContext as AuthContext } from './authContext.js'
import { getSession, subscribeSession, saveToken, removeToken, enterDemo, exitDemo } from '../data/session.js'

export default function AuthProvider({ children }) {
    const session = useSyncExternalStore(subscribeSession, getSession)
    const value = {
        token: session.isDemo ? null : session.token,
        user: session.isDemo ? null : session.user,
        isDemo: session.isDemo,
        hasAccess: session.isDemo || Boolean(session.token),
        saveToken, removeToken, enterDemo, exitDemo,
    }
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
