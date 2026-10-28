import { useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Spinner } from '@heroui/react'
import { dataClient } from '../../../data/client.js'
import { useResource } from '../../../hooks/useResource.js'
import PostCard from './PostCard.jsx'

export default function PostDetails() {
    const { postId } = useParams()
    return <PostContent key={postId} postId={postId} />
}

function PostContent({ postId }) {
    const load = useCallback(() => dataClient.getPost(postId), [postId])
    const { data: post, error, isLoading } = useResource(load)
    return (
        <div className="min-h-screen py-10 max-w-2xl mx-auto flex flex-col gap-5">
            <Link to="/" className="text-indigo-300 hover:text-white">← Back to feed</Link>
            {isLoading ? <Spinner aria-label="Loading post" color="secondary" /> : error || !post ?
                <p role="alert" className="text-slate-300">{error || 'Post not found'}</p> : <PostCard post={post} expanded />}
        </div>
    )
}
