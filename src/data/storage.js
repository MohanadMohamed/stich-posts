// Browsers can disable storage or run out of quota; keep the current visit usable.
export function readStorage(key) {
    try { return localStorage.getItem(key) } catch { return null }
}

export function writeStorage(key, value) {
    try {
        if (value === null) localStorage.removeItem(key)
        else localStorage.setItem(key, value)
        return true
    } catch { return false }
}
