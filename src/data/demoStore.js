import { z } from 'zod'
import { createDemoSeed } from './demoSeed.js'
import { readStorage, writeStorage } from './storage.js'

export const DEMO_DATA_KEY = 'stich.demoData.v1'
const userSchema = z.object({ _id: z.string(), name: z.string(), username: z.string(), email: z.string(), bio: z.string(), location: z.string() })
const commentSchema = z.object({ _id: z.string(), content: z.string(), createdAt: z.string().datetime(), commentCreator: userSchema })
const dataSchema = z.object({
    version: z.literal(1), currentUserId: z.string(), users: z.array(userSchema).min(1),
    posts: z.array(z.object({
        _id: z.string(), user: userSchema, body: z.string(), privacy: z.string(), createdAt: z.string().datetime(),
        likesCount: z.number().int().nonnegative(), liked: z.boolean(), comments: z.array(commentSchema),
        commentsCount: z.number().int().nonnegative(), topComment: commentSchema.nullable(),
    })),
}).refine(data => data.users.some(user => user._id === data.currentUserId))

export function createDemoStore(read = readStorage, write = writeStorage) {
    let data
    const listeners = new Set()
    let persistent = true

    function getSnapshot() {
        if (!data) {
            try { data = dataSchema.parse(JSON.parse(read(DEMO_DATA_KEY))) }
            catch { data = createDemoSeed() }
        }
        return data
    }

    function commit(next) {
        data = next
        persistent = write(DEMO_DATA_KEY, JSON.stringify(data))
        listeners.forEach(listener => listener())
    }

    function getPost(id) {
        const post = getSnapshot().posts.find(post => post._id === id)
        if (!post) throw new Error('Post not found')
        return post
    }

    function updatePost(post) {
        commit({ ...getSnapshot(), posts: data.posts.map(item => item._id === post._id ? post : item) })
        return post
    }

    function text(value) {
        const result = value.trim()
        if (!result) throw new Error('Please write something first.')
        return result
    }

    const getProfile = (id = getSnapshot().currentUserId) => {
        const user = getSnapshot().users.find(user => user._id === id)
        if (!user) throw new Error('Profile not found')
        return user
    }

    return {
        getSnapshot, getPost, getProfile,
        isPersistent: () => persistent,
        subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
        getPosts: userId => getSnapshot().posts.filter(post => !userId || post.user._id === userId),
        getComments: id => getPost(id).comments,
        createPost(body) {
            const post = { _id: `demo-post-${crypto.randomUUID()}`, body: text(body), user: getProfile(), createdAt: new Date().toISOString(), privacy: 'public', likesCount: 0, liked: false, comments: [], commentsCount: 0, topComment: null }
            commit({ ...getSnapshot(), posts: [post, ...data.posts] })
            return post
        },
        createComment(id, content) {
            const post = getPost(id)
            const comment = { _id: `demo-comment-${crypto.randomUUID()}`, content: text(content), commentCreator: getProfile(), createdAt: new Date().toISOString() }
            const comments = [comment, ...post.comments]
            updatePost({ ...post, comments, commentsCount: comments.length, topComment: comments[0] })
            return comment
        },
        toggleLike(id) {
            const post = getPost(id)
            return updatePost({ ...post, liked: !post.liked, likesCount: post.likesCount + (post.liked ? -1 : 1) })
        },
    }
}

export const demoStore = createDemoStore()
