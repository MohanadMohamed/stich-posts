import { useCallback } from 'react'
import PostCard from './PostCard'
import { dataClient } from '../../../data/client.js'
import { useDemoData } from '../../../hooks/useDemoData.js'
import { useResource } from '../../../hooks/useResource.js'
import { Spinner } from '@heroui/react'

export default function Posts({ userId }) {
    const demo = useDemoData()
    const load = useCallback(() => dataClient.getPosts(userId), [userId])
    const { data, error, isLoading } = useResource(load)
    const posts = demo ? demo.posts.filter(post => !userId || post.user._id === userId) : data
    if (!demo && isLoading) return <div className="flex justify-center py-20"><Spinner aria-label="Loading posts" color="secondary" /></div>
    if (!demo && error) return <p role="alert" className="text-rose-300">{error}</p>
    return (
        <section aria-label="Posts" className="py-6 flex flex-col gap-4">
            {posts?.length ? posts.map(post => <PostCard key={post._id} post={post} />) : <p className="text-slate-400">No posts yet. Share your first update!</p>}
        </section>
    )
}
