import { readStorage, writeStorage } from './storage.js'

export const DEMO_MODE_KEY = 'stich.demoMode'
const listeners = new Set()
const profileFields = ['_id', 'id', 'name', 'username', 'email', 'photo', 'bio', 'location', 'dateOfBirth', 'gender', 'createdAt']
function basicProfile(user) {
    return user && typeof user === 'object' && !Array.isArray(user) ? Object.fromEntries(
        profileFields.filter(key => typeof user[key] === 'string').map(key => [key, user[key]])
    ) : null
}
const readSession = () => {
    const token = readStorage('userToken')
    let user = null
    try { user = token ? basicProfile(JSON.parse(readStorage('userData'))) : null } catch { /* Ignore corrupt cached profile data. */ }
    return { token, user, isDemo: readStorage(DEMO_MODE_KEY) === 'true' }
}
let session = readSession()

export const getSession = () => session
export const subscribeSession = (listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

function update(next) {
    session = next
    listeners.forEach(listener => listener())
}

export function saveToken(token, user = null) {
    if (typeof token !== 'string' || !token.trim()) throw new Error('A valid authentication token is required.')
    // Cache only profile fields, never passwords or other response secrets.
    const profile = basicProfile(user)
    writeStorage(DEMO_MODE_KEY, null)
    writeStorage('userToken', token)
    writeStorage('userData', profile ? JSON.stringify(profile) : null)
    update({ token, user: profile, isDemo: false })
}

export function removeToken() {
    writeStorage('userToken', null)
    writeStorage('userData', null)
    update({ ...session, token: null, user: null })
}

export function enterDemo() {
    writeStorage(DEMO_MODE_KEY, 'true')
    update({ ...session, isDemo: true })
}

export function exitDemo() {
    writeStorage(DEMO_MODE_KEY, null)
    update({ ...session, isDemo: false })
}

// Route guards and the request boundary also stay in sync across tabs.
if (typeof window !== 'undefined') {
    window.addEventListener('storage', event => {
        if (event.key === null || ['userToken', 'userData', DEMO_MODE_KEY].includes(event.key)) update(readSession())
    })
}
