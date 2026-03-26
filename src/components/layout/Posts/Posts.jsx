import React, { useEffect, useState } from 'react'
import PostCard from './PostCard'
import axios from 'axios'
import { Spinner } from '@heroui/react'

export default function Posts() {

    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true) 

    useEffect(() => {
        async function getAllPosts() {
            try {
                const { data } = await axios.request({
                    method: "GET",
                    url: "https://route-posts.routemisr.com/posts",
                    headers: {
                        Token: localStorage.getItem('userToken')
                    },
                    params: {
                        limit: 20,
                        sort: '-createdAt'
                    }
                })
                setPosts(data.data.posts)
            } catch (error) {
                console.log(error.message);
            } finally {
                setIsLoading(false) 
            }
        }
        getAllPosts()
    }, [])

    if (isLoading) return (
        <div className="flex justify-center items-center py-20">
            <Spinner color="secondary" size="lg" />
        </div>
    )

    return (
        <section className='py-12 flex flex-col gap-4'>
            {posts.map((post) => (
                <PostCard key={post._id} post={post} />
            ))}
        </section>
    )
}