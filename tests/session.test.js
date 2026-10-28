import assert from 'node:assert/strict'
import { test } from 'node:test'

test('demo session survives reload, overrides saved auth, exits cleanly and does not contaminate real login', async () => {
    const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
    const values = new Map([['userToken', 'test-only-existing-token']])
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
        removeItem: key => values.delete(key),
    } })
    try {
        const session = await import('../src/data/session.js?test=initial')
        assert.equal(session.getSession().isDemo, false)
        session.enterDemo()
        assert.equal(values.get(session.DEMO_MODE_KEY), 'true')
        const reloaded = await import('../src/data/session.js?test=reloaded')
        assert.equal(reloaded.getSession().isDemo, true)
        assert.equal(reloaded.getSession().token, 'test-only-existing-token')
        reloaded.exitDemo()
        assert.equal(reloaded.getSession().isDemo, false)
        assert.equal(values.has(session.DEMO_MODE_KEY), false)
        reloaded.enterDemo()
        reloaded.saveToken('test-only-new-token')
        assert.deepEqual(reloaded.getSession(), { token: 'test-only-new-token', user: null, isDemo: false })
        assert.equal(values.has(session.DEMO_MODE_KEY), false)
        reloaded.removeToken()
        assert.equal(values.has('userToken'), false)
        assert.equal(reloaded.getSession().token, null)
        const profile = { _id: 'test-user', name: 'Jamie Example', email: 'jamie@example.test' }
        reloaded.saveToken('test-only-token', { ...profile, password: 'never-store-this', rePassword: 'never-store-this' })
        assert.deepEqual(reloaded.getSession().user, profile)
        assert.deepEqual(JSON.parse(values.get('userData')), profile)
        const withUser = await import('../src/data/session.js?test=with-user')
        assert.deepEqual(withUser.getSession().user, profile)
        withUser.enterDemo()
        assert.deepEqual(withUser.getSession().user, profile)
        withUser.exitDemo()
        assert.deepEqual(withUser.getSession().user, profile)
        assert.throws(() => withUser.saveToken(undefined), /valid authentication token/)
        assert.equal(withUser.getSession().token, 'test-only-token')
        withUser.removeToken()
        assert.equal(values.has('userData'), false)
    } finally {
        if (previous) Object.defineProperty(globalThis, 'localStorage', previous)
        else delete globalThis.localStorage
    }
})
