import axios from 'axios'
import { API_BASE_URL } from './apiConfig.js'
import { getSession } from './session.js'
import { registerSchema } from '../schemas/register.schema.js'

class AuthError extends Error {}

function responseMessage(body) {
    if (typeof body?.message === 'string' && body.message.trim()) return body.message
    if (typeof body?.errors === 'string' && body.errors.trim()) return body.errors
    if (Array.isArray(body?.errors)) {
        const messages = body.errors.map(error => typeof error === 'string' ? error : error?.message || error?.msg)
            .filter(message => typeof message === 'string' && message.trim())
        if (messages.length) return messages.join(' ')
    }
    return null
}

export function getAuthErrorMessage(error, action = 'signup') {
    const message = responseMessage(error.response?.data)
    if (message) return message
    if (error instanceof AuthError) return error.message
    if (error.response?.status === 409) return 'An account with this email or username already exists.'
    if (error.response?.status === 400) return 'Please check your details and try again.'
    if (!error.response) return 'Unable to reach the server. Check your connection and try again.'
    return action === 'signup' ? 'Unable to create your account. Please try again.' : 'Unable to sign in. Please try again.'
}

// Auth requests are public JSON requests and never inherit an account token.
export function createAuthClient(request = axios.request, session = getSession) {
    async function authenticate(path, values) {
        const initial = session()
        if (initial.isDemo) throw new AuthError('Exit Demo Mode before signing in or creating an account.')
        const payload = path === 'signup' ? registerSchema.parse(values) : values
        const { data: body } = await request({
            method: 'POST', url: `${API_BASE_URL}/users/${path}`, data: payload,
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            timeout: 15000,
        })
        const current = session()
        if (current.isDemo || current.token !== initial.token) {
            throw new AuthError('Your session changed while this request was in progress. Please try again.')
        }
        if (body?.success === false) throw new AuthError(responseMessage(body) || 'Please check your details and try again.')
        const { token, user } = body?.data || {}
        if (typeof token !== 'string' || !token.trim() || (path === 'signup' && (!user || typeof user !== 'object' || Array.isArray(user)))) {
            throw new AuthError(path === 'signup'
                ? 'Your account may have been created, but automatic sign-in could not be completed. Please log in.'
                : 'Sign-in could not be completed. Please try again.')
        }
        return { token, user: user || null }
    }
    return {
        signup: values => authenticate('signup', values),
        signin: values => authenticate('signin', values),
    }
}

export const authClient = createAuthClient()
