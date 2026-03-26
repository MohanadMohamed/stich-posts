import React, { useState } from 'react'
import Posts from '../../components/layout/Posts/Posts'
import AddPost from '../../components/layout/Posts/AddPost'

export default function Home() {
    const [refresh, setRefresh] = useState(0)

    return (
        <div className="min-h-screen py-10">
            <div className="max-w-2xl mx-auto px-4 flex flex-col gap-5">
                <div className="mb-2">
                    <h1 className="text-white text-2xl font-bold">Home Feed</h1>
                    <p className="text-slate-400 text-sm mt-1">Latest posts from the community</p>
                </div>
                <AddPost onPostAdded={() => setRefresh(r => r + 1)} />
                <Posts key={refresh} />
            </div>
        </div>
    )
}