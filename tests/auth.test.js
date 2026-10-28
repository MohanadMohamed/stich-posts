import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createAuthClient, getAuthErrorMessage } from '../src/data/authClient.js'
import { registerSchema } from '../src/schemas/register.schema.js'

const values = {
    name: 'Jamie Example', username: 'JamieExample', email: 'jamie@example.test',
    password: 'TestOnly!123', rePassword: 'TestOnly!123', dateOfBirth: '2000-01-01', gender: 'female',
}
const user = { _id: 'test-user', name: values.name, username: values.username, email: values.email }
const response = { data: { success: true, data: { token: 'test-only-token', user } } }

test('signup uses the documented URL, all seven JSON fields, and no authenticated headers', async () => {
    let config
    const client = createAuthClient(async request => { config = request; return response }, () => ({ isDemo: false }))
    assert.deepEqual(await client.signup({ ...values, ignored: 'never send extra fields' }), response.data.data)
    assert.equal(config.url, 'https://route-posts.routemisr.com/users/signup')
    assert.equal(config.method, 'POST')
    assert.equal(config.timeout, 15000)
    assert.deepEqual(config.headers, { 'Content-Type': 'application/json', Accept: 'application/json' })
    assert.deepEqual(config.data, values)
})

test('signup accepts full names and mixed-case usernames and preserves calendar dates', () => {
    assert.equal(registerSchema.parse(values).name, 'Jamie Example')
    assert.equal(registerSchema.parse({ ...values, name: '  Jamie Example  ', username: ' JamieExample ' }).username, 'JamieExample')
    assert.equal(registerSchema.parse({ ...values, dateOfBirth: '2000-02-29' }).dateOfBirth, '2000-02-29')
    assert.equal(registerSchema.parse({ ...values, email: ' jamie@example.test ' }).email, values.email)
})

test('invalid form values fail before any signup request', async () => {
    let calls = 0
    const client = createAuthClient(async () => { calls++; return response }, () => ({ isDemo: false }))
    for (const invalid of [
        { name: '  ' }, { username: 'has spaces' }, { email: 'invalid' },
        { password: 'weak' }, { rePassword: 'different' }, { dateOfBirth: '' },
        { dateOfBirth: '2000-02-30' }, { dateOfBirth: '2999-01-01' }, { gender: '' },
    ]) await assert.rejects(client.signup({ ...values, ...invalid }))
    assert.equal(calls, 0)
})

test('signup rejects application-level failure and incomplete success responses', async () => {
    for (const data of [
        { success: false, message: 'Please check your details.' },
        { success: true, data: { user } }, { success: true, data: { token: 'test-only-token' } },
        { success: true, data: { token: '', user } },
    ]) {
        const client = createAuthClient(async () => ({ data }), () => ({ isDemo: false }))
        await assert.rejects(client.signup(values))
    }
})

test('400, 409, network, timeout, and malformed server errors produce readable messages', async () => {
    const cases = [
        [{ response: { status: 400, data: { message: 'Invalid date of birth' } } }, 'Invalid date of birth'],
        [{ response: { status: 400, data: { errors: [{ message: 'Username is invalid' }] } } }, 'Username is invalid'],
        [{ response: { status: 400, data: {} } }, 'Please check your details'],
        [{ response: { status: 409, data: {} } }, 'already exists'],
        [{ response: { status: 409, data: { message: 'Email already registered' } } }, 'Email already registered'],
        [{ code: 'ERR_NETWORK' }, 'Check your connection'],
        [{ code: 'ECONNABORTED' }, 'Check your connection'],
        [{ response: { status: 500, data: { message: { unexpected: true } } } }, 'Unable to create your account'],
    ]
    for (const [error, expected] of cases) {
        const client = createAuthClient(async () => { throw error }, () => ({ isDemo: false }))
        try { await client.signup(values); assert.fail('Expected signup to fail') }
        catch (caught) { assert.ok(getAuthErrorMessage(caught).includes(expected)) }
    }
})

test('login retains its public endpoint and token/user handling', async () => {
    let config
    const client = createAuthClient(async request => { config = request; return response }, () => ({ isDemo: false }))
    const loginValues = { email: values.email, password: values.password }
    assert.deepEqual(await client.signin(loginValues), response.data.data)
    assert.equal(config.url, 'https://route-posts.routemisr.com/users/signin')
    assert.deepEqual(config.data, loginValues)
    assert.equal(config.headers.Authorization, undefined)
    assert.equal(config.headers.Token, undefined)
})

test('Demo Mode blocks signup and login at the request boundary', async () => {
    let calls = 0
    const client = createAuthClient(async () => { calls++; return response }, () => ({ isDemo: true, token: 'test-only-token' }))
    await assert.rejects(client.signup(values), /Exit Demo Mode/)
    await assert.rejects(client.signin(values), /Exit Demo Mode/)
    assert.equal(calls, 0)
})

test('late signup/login responses cannot replace Demo Mode or a newer session', async () => {
    for (const action of ['signup', 'signin']) {
        for (const next of [{ isDemo: true, token: null }, { isDemo: false, token: 'test-only-new-session' }]) {
            let session = { isDemo: false, token: null }
            let complete
            const client = createAuthClient(() => new Promise(resolve => { complete = resolve }), () => session)
            const pending = client[action](values)
            session = next
            complete(response)
            await assert.rejects(pending, /session changed/)
            assert.equal(session, next)
        }
    }
})
