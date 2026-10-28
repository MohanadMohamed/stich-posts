import { useCallback, useState } from 'react'
import { Avatar, Spinner } from '@heroui/react'
import { dataClient } from '../../data/client.js'
import { useResource } from '../../hooks/useResource.js'
import Posts from '../../components/layout/Posts/Posts.jsx'
import AddPost from '../../components/layout/Posts/AddPost.jsx'

export default function Profile() {
    const load = useCallback(() => dataClient.getProfile(), [])
    const { data: user, error, isLoading } = useResource(load)
    const [refresh, setRefresh] = useState(0)
    if (isLoading) return <Spinner aria-label="Loading profile" color="secondary" />
    if (error || !user) return <p role="alert" className="text-rose-300">{error || 'Profile not found'}</p>
    return (
        <div className="min-h-screen max-w-2xl mx-auto py-10 flex flex-col gap-5">
            <section className="bg-slate-800 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-4 items-center">
                    <Avatar name={user.name} src={user.photo} size="lg" />
                    <div><h1 className="text-white text-2xl font-bold">{user.name}</h1><p className="text-indigo-300">@{user.username}</p></div>
                </div>
                {user.bio && <p className="mt-4 text-slate-300">{user.bio}</p>}
                {user.location && <p className="mt-2 text-sm text-slate-400">{user.location}</p>}
            </section>
            <AddPost onPostAdded={() => setRefresh(value => value + 1)} />
            <h2 className="text-xl text-white font-semibold">My posts</h2>
            <Posts key={refresh} userId={user._id} />
        </div>
    )
}
