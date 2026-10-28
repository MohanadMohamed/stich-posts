import { useCallback, useState } from 'react'
import {
    Card, CardHeader, CardBody, CardFooter,
    Avatar, Divider, Chip, Spinner,
    Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,
} from '@heroui/react'
import { Link, useNavigate } from 'react-router-dom'
import { dataClient } from '../../../data/client.js'
import { useDemoData } from '../../../hooks/useDemoData.js'
import { useResource } from '../../../hooks/useResource.js'

export default function PostCard({ post: initialPost, expanded = false }) {
    const navigate = useNavigate()
    const demo = useDemoData()
    const post = demo?.posts.find(item => item._id === initialPost._id) || initialPost
    const me = demo?.users.find(user => user._id === demo.currentUserId)
    const [liveLiked, setLiveLiked] = useState(false)
    const [liveLikesCount, setLiveLikesCount] = useState(post.likesCount || 0)
    const liked = demo ? post.liked : liveLiked
    const likesCount = demo ? post.likesCount : liveLikesCount
    const [showComments, setShowComments] = useState(expanded)
    const [addedComments, setAddedComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [isCommenting, setIsCommenting] = useState(false)
    const [error, setError] = useState('')
    const loadComments = useCallback(() => showComments ? dataClient.getComments(post._id) : Promise.resolve([]), [showComments, post._id])
    const { data: loadedComments, error: commentsError, isLoading: isLoadingComments } = useResource(loadComments)
    const comments = demo ? post.comments : [...addedComments, ...(loadedComments || []).filter(comment => !addedComments.some(added => added._id === comment._id))]
    const commentsCount = demo ? post.commentsCount : (post.commentsCount || 0) + addedComments.length

    function handleLike() {
        if (demo) {
            dataClient.toggleDemoLike(post._id)
        } else {
            // Preserve the existing optimistic like behavior for signed-in users.
            setLiveLiked(!liveLiked)
            setLiveLikesCount(liveLiked ? liveLikesCount - 1 : liveLikesCount + 1)
        }
    }

    async function handleAddComment() {
        if (!newComment.trim() || isCommenting) return
        try {
            setIsCommenting(true)
            setError('')
            const comment = await dataClient.createComment(post._id, newComment)
            setAddedComments(previous => [comment, ...previous])
            setNewComment('')
        } catch (error) {
            setError(error.response?.data?.message || error.message)
        } finally {
            setIsCommenting(false)
        }
    }

    function handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault()
            handleAddComment()
        }
    }

    return (
        <Card as="article" aria-label={`Post by ${post.user?.name}`} className="bg-slate-800 border border-white/10 rounded-2xl shadow-xl w-full">

            {/* Header */}
            <CardHeader className="flex items-start justify-between gap-3 px-5 pt-5">
                <div className="flex gap-3 items-center">
                    <Avatar
                        isBordered
                        src={post.user?.photo}
                        name={post.user?.name}
                        size="sm"
                        classNames={{ base: "border-indigo-400/50" }}
                    />
                    <div className="flex flex-col">
                        <p className="text-white font-semibold text-sm">{post.user?.name}</p>
                        <p className="text-slate-400 text-xs">@{post.user?.username} · {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {post.privacy && (
                        <Chip size="sm" className="bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs">
                            {post.privacy}
                        </Chip>
                    )}
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <button aria-label="Post actions" className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-7 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm14 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                                </svg>
                            </button>
                        </DropdownTrigger>
                        <DropdownMenu disabledKeys={demo ? ["edit", "share", "report", "delete"] : []} aria-label="Post Actions" classNames={{ base: "bg-slate-900 border border-white/10 rounded-xl shadow-xl" }}>
                            <DropdownItem key="edit" className="text-slate-300" textValue="Edit Post">✏️ Edit Post</DropdownItem>
                            <DropdownItem key="share" className="text-slate-300" textValue="Share Post">🔗 Share Post</DropdownItem>
                            <DropdownItem key="report" className="text-slate-300" textValue="Report">🚩 Report</DropdownItem>
                            <DropdownItem key="delete" color="danger" className="text-red-400" textValue="Delete Post">🗑️ Delete Post</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            </CardHeader>

            <Divider className="bg-white/10 my-1" />

            {/* Body */}
            <CardBody onClick={expanded ? undefined : () => navigate(`/posts/${post._id}`)} className="px-5 py-4">
                {post.body && post.body !== 'null' && (
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap break-words">{post.body}</p>
                )}
                {post.image && (
                    <img src={post.image} alt="post" className="mt-3 rounded-xl w-full object-cover max-h-72" />
                )}
            </CardBody>

            {!expanded && <div className="px-5 pb-3"><Link to={`/posts/${post._id}`} className="text-indigo-300 hover:text-white text-xs">View post</Link></div>}
            {/* Top Comment */}
            {post.topComment && !showComments && (
                <>
                    <Divider className="bg-white/10" />
                    <div className="px-5 py-3">
                        <p className="text-slate-500 text-xs mb-2 font-medium">💬 Top Comment</p>
                        <div className="flex gap-3 items-start">
                            <Avatar
                                src={post.topComment.commentCreator?.photo}
                                name={post.topComment.commentCreator?.name}
                                size="sm"
                                classNames={{ base: "shrink-0" }}
                            />
                            <div className="bg-slate-700/50 rounded-2xl px-4 py-2 flex-1">
                                <p className="text-white text-xs font-semibold">{post.topComment.commentCreator?.name}</p>
                                <p className="text-slate-300 text-sm mt-0.5">{post.topComment.content}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            <Divider className="bg-white/10" />

            {/* Footer */}
            <CardFooter className="px-5 py-3 flex items-center justify-between">
                <div className="flex gap-4">
                    {/* Like */}
                    <button aria-label={liked ? "Unlike post" : "Like post"} aria-pressed={liked} onClick={handleLike} className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-rose-400' : 'text-slate-400 hover:text-rose-400'}`}>
                        <svg
                            className={`w-4 h-4 transition-all ${liked ? 'fill-rose-400 scale-110' : ''}`}
                            fill={liked ? 'currentColor' : 'none'}
                            viewBox="0 0 24 24" stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                        </svg>
                        <span className="text-xs">{likesCount}</span>
                    </button>

                    {/* Comment toggle */}
                    <button
                        aria-label="Comments" aria-expanded={showComments} onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-1.5 transition-colors ${showComments ? 'text-indigo-400' : 'text-slate-400 hover:text-indigo-400'}`}
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                        <span className="text-xs">{commentsCount}</span>
                    </button>
                </div>

                {/* Share */}
                <button disabled={Boolean(demo)} title={demo ? "Sharing is unavailable in Demo Mode" : undefined} className="flex items-center gap-1.5 text-slate-400 hover:text-indigo-400 disabled:opacity-40 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                    <span className="text-xs">Share</span>
                </button>
            </CardFooter>

            {/* Comments Section */}
            {showComments && (
                <>
                    <Divider className="bg-white/10" />
                    <div className="px-5 py-4 flex flex-col gap-4">

                        {/* Add Comment Input  */}
                        <div className="flex gap-3 items-center">
                            <Avatar name={me?.name || "Me"} size="sm" isBordered classNames={{ base: "border-indigo-400/50 shrink-0" }} />
                            <div className="flex-1 flex items-center gap-2 bg-slate-700/50 rounded-full px-4 py-2">
                                <input
                                    type="text"
                                    aria-label="Write a comment"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="min-w-0 flex-1 bg-transparent text-white text-sm outline-none placeholder:text-slate-400"
                                />
                                <button
                                    aria-label="Send comment"
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

                        {(error || commentsError) && <p role="alert" className="text-rose-300 text-sm">{error || commentsError}</p>}
                        {/* Comments List */}
                        {!demo && isLoadingComments ? (
                            <div className="flex justify-center py-4">
                                <Spinner color="secondary" size="sm" />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-3">
                                {comments.map((comment) => (
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
                                                <button disabled={Boolean(demo)} title={demo ? "Comment likes are unavailable in Demo Mode" : undefined} className="text-slate-500 hover:text-rose-400 disabled:opacity-40 text-xs transition-colors">Like</button>
                                                <button disabled={Boolean(demo)} title={demo ? "Replies are unavailable in Demo Mode" : undefined} className="text-slate-500 hover:text-indigo-400 disabled:opacity-40 text-xs transition-colors">Reply</button>
                                                <span className="text-slate-600 text-xs">{new Date(comment.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {comments.length === 0 && (
                                    <p className="text-slate-500 text-xs text-center py-2">No comments yet. Be the first! 👀</p>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </Card>
    )
}