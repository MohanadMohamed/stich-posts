import axios from 'axios'
import { demoStore } from './demoStore.js'
import { getSession, removeToken } from './session.js'
import { API_BASE_URL } from './apiConfig.js'

// Select the local store before constructing requests or attaching credentials.
export function createDataClient(session = getSession, demo = demoStore, request = axios.request, onUnauthorized = removeToken) {
    async function live(config) {
        const { token, isDemo } = session()
        if (isDemo || !token) throw new Error('Please sign in to continue.')
        try {
            const { data } = await request({ ...config, url: API_BASE_URL + config.url, headers: { Token: token } })
            return data.data
        } catch (error) {
            const current = session()
            // A late failure from an old request must not log out another user
            // or interrupt Demo Mode, which can retain the original token.
            if (error.response?.status === 401 && !current.isDemo && current.token === token) onUnauthorized()
            throw error
        }
    }

    return {
        async getPosts(userId) {
            if (session().isDemo) return demo.getPosts(userId)
            const data = await live({ method: 'GET', url: userId ? `/users/${userId}/posts` : '/posts', params: { limit: 20, sort: '-createdAt' } })
            return data.posts
        },
        async getPost(id) {
            if (session().isDemo) return demo.getPost(id)
            return (await live({ method: 'GET', url: `/posts/${id}` })).post
        },
        async getComments(id) {
            if (session().isDemo) return demo.getComments(id)
            return (await live({ method: 'GET', url: `/posts/${id}/comments` })).comments
        },
        async createPost(body) {
            if (session().isDemo) return demo.createPost(body)
            const data = new FormData()
            data.append('body', body.trim())
            data.append('privacy', 'public')
            return (await live({ method: 'POST', url: '/posts', data })).post
        },
        async createComment(id, content) {
            if (session().isDemo) return demo.createComment(id, content)
            const data = new FormData()
            data.append('content', content.trim())
            return (await live({ method: 'POST', url: `/posts/${id}/comments`, data })).comment
        },
        async getProfile() {
            if (session().isDemo) return demo.getProfile()
            return (await live({ method: 'GET', url: '/users/profile-data' })).user
        },
        toggleDemoLike(id) {
            if (!session().isDemo) throw new Error('Demo Mode is not active.')
            return demo.toggleLike(id)
        },
    }
}

export const dataClient = createDataClient()
