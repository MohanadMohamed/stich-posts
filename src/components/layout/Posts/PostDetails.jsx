import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Avatar, Chip, Divider, Spinner } from '@heroui/react'
import axios from 'axios'

export default function PostDetails() {

    const { postId } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [newComment, setNewComment] = useState('')
    const [isCommenting, setIsCommenting] = useState(false)
    const [liked, setLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)

    useEffect(() => {
        async function getPostDetails() {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    axios.get(`https://route-posts.routemisr.com/posts/${postId}`, {
                        headers: { Token: localStorage.getItem('userToken') }
                    }),
                    axios.get(`https://route-posts.routemisr.com/posts/${postId}/comments`, {
                        headers: { Token: localStorage.getItem('userToken') }
                    })
                ])
                setPost(postRes.data.data.post)
                setLikesCount(postRes.data.data.post?.likesCount || 0)
                setComments(commentsRes.data.data.comments)
            } catch (error) {
                console.log(error.message)
            } finally {
                setIsLoading(false)
            }
        }
        getPostDetails()
    }, [postId])

    async function handleAddComment() {
        if (!newComment.trim()) return
        try {
            setIsCommenting(true)
            const formData = new FormData()
            formData.append('content', newComment)
            const { data } = await axios.request({
                method: "POST",
                url: `https://route-posts.routemisr.com/posts/${postId}/comments`,
                headers: { Token: localStorage.getItem('userToken') },
                data: formData
            })
            setComments(prev => [data.data.comment, ...prev])
            setNewComment('')
        } catch (error) {
            console.log(error.message)
        } finally {
            setIsCommenting(false)
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleAddComment()
        }
    }

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-screen">
            <Spinner color="secondary" size="lg" />
        </div>
    )

    if (!post) return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-slate-400">Post not found</p>
        </div>
    )

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-2xl mx-auto px-4 flex flex-col gap-5">

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors w-fit"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="text-sm">Back</span>
                </button>

                {/* Post */}
                <div className="bg-slate-800 border border-white/10 rounded-2xl shadow-xl w-full">

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
                        <div className="flex gap-3 items-center">
                            <Avatar
                                isBordered
                                src={post.user?.photo}
                                name={post.user?.name}
                                size="md"
                                classNames={{ base: "border-indigo-400/50" }}
                            />
                            <div className="flex flex-col">
                                <p className="text-white font-semibold text-sm">{post.user?.name}</p>
                                <p className="text-slate-400 text-xs">@{post.user?.username} · {new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {post.privacy && (
                            <Chip size="sm" className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs">
                                {post.privacy}
                            </Chip>
                        )}
                    </div>

                    <Divider className="bg-white/10" />

                    {/* Body */}
                    <div className="px-5 py-4">
                        {post.body && post.body !== 'null' && (
                            <p className="text-slate-200 text-base leading-relaxed">{post.body}</p>
                        )}
                        {post.image && (
                            <img src={post.image} alt="post" className="mt-4 rounded-xl w-full object-cover" />
                        )}
                    </div>

                    <Divider className="bg-white/10" />

                    {/* Stats */}
                    <div className="px-5 py-3 flex items-center gap-4">
                        <button
                            onClick={() => { setLiked(!liked); setLikesCount(liked ? likesCount - 1 : likesCount + 1) }}
                            className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'}`}
                        >
                            <svg className={`w-5 h-5 ${liked ? 'fill-rose-400' : ''}`} fill={liked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm">{likesCount} Likes</span>
                        </button>
                        <span className="text-slate-500 text-sm">{comments.length} Comments</span>
                    </div>

                    <Divider className="bg-white/10" />

                    {/* Add Comment */}
                    <div className="px-5 py-4 flex gap-3 items-center">
                        <Avatar name="Me" size="sm" isBordered classNames={{ base: "border-indigo-400/50 shrink-0" }} />
                        <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-full px-4 py-2">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-400"
                            />
                            <button
                                onClick={handleAddComment}
                                disabled={!newComment.trim() || isCommenting}
                                className="text-indigo-400 hover:text-indigo-300 disabled:opacity-30 transition-colors"
                            >
                                {isCommenting ? (
                                    <Spinner size="sm" color="secondary" />
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <Divider className="bg-white/10" />

                    {/* Comments List */}
                    <div className="px-5 py-4 flex flex-col gap-4">
                        {comments.length === 0 ? (
                            <p className="text-slate-500 text-sm text-center py-4">No comments yet. Be the first! 👀</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment._id} className="flex gap-3 items-start">
                                    <Avatar
                                        src={comment.commentCreator?.photo}
                                        name={comment.commentCreator?.name}
                                        size="sm"
                                        classNames={{ base: "shrink-0" }}
                                    />
                                    <div className="flex flex-col gap-1">
                                        <div className="bg-slate-700/50 rounded-2xl px-4 py-2">
                                            <p className="text-white text-xs font-semibold">{comment.commentCreator?.name}</p>
                                            <p className="text-slate-300 text-sm mt-0.5">{comment.content}</p>
                                        </div>
                                        <div className="flex gap-3 px-2">
                                            <button className="text-slate-500 hover:text-rose-400 text-xs transition-colors">Like</button>
                                            <button className="text-slate-500 hover:text-indigo-400 text-xs transition-colors">Reply</button>
                                            <span className="text-slate-600 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}