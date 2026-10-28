import { readStorage, writeStorage } from './storage.js'

export const DEMO_MODE_KEY = 'stich.demoMode'
const listeners = new Set()
const readSession = () => ({ token: readStorage('userToken'), isDemo: readStorage(DEMO_MODE_KEY) === 'true' })
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

export function saveToken(token) {
    writeStorage(DEMO_MODE_KEY, null)
    writeStorage('userToken', token)
    update({ token, isDemo: false })
}

export function removeToken() {
    writeStorage('userToken', null)
    update({ ...session, token: null })
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
        if (event.key === null || ['userToken', DEMO_MODE_KEY].includes(event.key)) update(readSession())
    })
}
