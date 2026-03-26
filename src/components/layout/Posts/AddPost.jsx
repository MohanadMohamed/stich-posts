import React, { useState } from 'react'
import { Avatar, Button, Textarea } from '@heroui/react'
import axios from 'axios'

export default function AddPost({ onPostAdded }) {

    const [body, setBody] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    async function handleAddPost() {
        if (!body.trim()) return
        try {
            setIsLoading(true)
            const formData = new FormData()
            formData.append('body', body)
            formData.append('privacy', 'public')

            await axios.request({
                method: "POST",
                url: "https://route-posts.routemisr.com/posts",
                headers: { Token: localStorage.getItem('userToken') },
                data: formData
            })

            setBody('')
            onPostAdded?.()
        } catch (error) {
            console.log(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-slate-800 border border-white/10 rounded-2xl shadow-xl w-full p-5 flex flex-col gap-4">
            <div className="flex gap-3 items-center">
                <Avatar name="Me" size="sm" isBordered classNames={{ base: "border-indigo-400/50 shrink-0" }} />
                <p className="text-slate-400 text-sm">What's on your mind?</p>
            </div>
            <Textarea
                placeholder="Write something..."
                value={body}
                onValueChange={setBody}
                minRows={3}
                classNames={{
                    input: "bg-transparent text-white text-sm",
                    inputWrapper: "bg-white/5 border border-white/10 hover:border-indigo-400/50 focus-within:border-indigo-400",
                }}
            />
            <div className="flex justify-end">
                <Button
                    onPress={handleAddPost}
                    isLoading={isLoading}
                    isDisabled={!body.trim()}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl px-6 shadow-lg shadow-indigo-500/25"
                    size="sm"
                >
                    Post
                </Button>
            </div>
        </div>
    )
}