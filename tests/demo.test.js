import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createDemoStore, DEMO_DATA_KEY } from '../src/data/demoStore.js'
import { createDataClient } from '../src/data/client.js'

function fixture(initial) {
    const storage = new Map(initial ? [[DEMO_DATA_KEY, initial]] : [])
    const read = key => storage.get(key) ?? null
    const write = (key, value) => { storage.set(key, value); return true }
    return { store: createDemoStore(read, write), reload: () => createDemoStore(read, write) }
}

test('demo creates posts, comments and likes without any network requests, even with a saved token', async () => {
    const { store, reload } = fixture()
    let requests = 0
    const client = createDataClient(() => ({ isDemo: true, token: 'test-only-existing-token' }), store, () => {
        requests++
        throw new Error('Demo must never reach the network')
    })
    const profile = await client.getProfile()
    const originalPosts = await client.getPosts()
    assert.ok(originalPosts.length >= 4)
    assert.ok(new Set(originalPosts.map(post => post.user._id)).size >= 3)
    const post = await client.createPost('  My weekend plans  ')
    assert.equal(post.body, 'My weekend plans')
    assert.equal(post.user._id, profile._id)
    assert.equal((await client.getPosts())[0]._id, post._id)
    const comment = await client.createComment(post._id, '  Looking forward to it!  ')
    assert.equal(comment.content, 'Looking forward to it!')
    assert.equal((await client.getComments(post._id))[0]._id, comment._id)
    assert.equal((await client.getPost(post._id)).commentsCount, 1)
    assert.equal(client.toggleDemoLike(post._id).likesCount, 1)
    assert.equal(client.toggleDemoLike(post._id).likesCount, 0)
    client.toggleDemoLike(post._id)
    assert.ok((await client.getPosts(profile._id)).every(item => item.user._id === profile._id))
    const restored = reload().getPost(post._id)
    assert.equal(restored.liked, true)
    assert.equal(restored.likesCount, 1)
    assert.equal(restored.comments[0]._id, comment._id)
    assert.equal(restored.topComment._id, comment._id)
    assert.equal(requests, 0)
})

test('invalid demo routes and blank mutations fail locally', async () => {
    const { store } = fixture()
    const client = createDataClient(() => ({ isDemo: true }), store, () => assert.fail('Unexpected network request'))
    await assert.rejects(client.getPost('not-a-demo-post'), /Post not found/)
    await assert.rejects(client.getComments('not-a-demo-post'), /Post not found/)
    await assert.rejects(client.createPost('   '), /write something/)
    await assert.rejects(client.createComment(store.getPosts()[0]._id, '\n'), /write something/)
    assert.equal(store.getPosts().length, 4)
})

test('corrupt, outdated, and structurally invalid storage recover to valid demo data', () => {
    for (const invalid of ['{broken', 'null', '{"version":0}', '{"version":1,"users":[],"posts":[]}', JSON.stringify({ ...fixture().store.getSnapshot(), posts: [{ _id: 'broken' }] })]) {
        const { store } = fixture(invalid)
        assert.equal(store.getSnapshot().version, 1)
        assert.equal(store.getProfile().name, 'Alex Morgan')
        assert.equal(store.getPosts().length, 4)
    }
})

test('storage failure keeps interactions usable in memory and reports persistence failure', () => {
    const store = createDemoStore(() => null, () => false)
    const post = store.createPost('Memory-only post')
    store.createComment(post._id, 'Still works')
    store.toggleLike(post._id)
    assert.equal(store.getPost(post._id).commentsCount, 1)
    assert.equal(store.isPersistent(), false)
})

test('unauthenticated callers cannot send API requests and stale clients observe mode changes', async () => {
    let session = { token: null, isDemo: false }
    let calls = 0
    const client = createDataClient(() => session, fixture().store, async () => {
        calls++
        return { data: { data: { posts: [] } } }
    })
    await assert.rejects(client.getPosts(), /sign in/)
    await assert.rejects(client.createPost('No session'), /sign in/)
    session = { token: 'test-only-token', isDemo: false }
    await client.getPosts()
    assert.equal(calls, 1)
    session = { ...session, isDemo: true }
    assert.equal((await client.getPosts()).length, 4)
    await client.createPost('Local after mode switch')
    assert.equal(calls, 1)
})

test('authenticated operations retain API URLs, token headers, multipart bodies and response shapes', async () => {
    const calls = []
    const post = { _id: 'live-post' }
    const comment = { _id: 'live-comment' }
    const user = { _id: 'live-user' }
    const client = createDataClient(() => ({ token: 'test-only-token', isDemo: false }), fixture().store, async config => {
        calls.push(config)
        return { data: { data: { posts: [post], post, comments: [comment], comment, user } } }
    })
    assert.deepEqual(await client.getPosts(), [post])
    assert.deepEqual(await client.getPost(post._id), post)
    assert.deepEqual(await client.getComments(post._id), [comment])
    assert.deepEqual(await client.createPost('Hello world'), post)
    assert.deepEqual(await client.createComment(post._id, 'Hello back'), comment)
    assert.deepEqual(await client.getProfile(), user)
    await client.getPosts(user._id)
    assert.deepEqual(calls.map(call => call.url), [
        '/posts', '/posts/live-post', '/posts/live-post/comments', '/posts',
        '/posts/live-post/comments', '/users/profile-data', '/users/live-user/posts',
    ].map(path => `https://route-posts.routemisr.com${path}`))
    assert.ok(calls.every(call => call.headers.Token === 'test-only-token'))
    assert.equal(calls[3].method, 'POST')
    assert.equal(calls[3].data.get('body'), 'Hello world')
    assert.equal(calls[3].data.get('privacy'), 'public')
    assert.equal(calls[4].data.get('content'), 'Hello back')
    assert.throws(() => client.toggleDemoLike(post._id), /not active/)
})

test('a 401 clears the current rejected session, while other errors preserve it', async () => {
    for (const status of [401, 403, 500]) {
        let session = { token: 'test-only-expired-token', isDemo: false }
        let cleared = 0
        const error = { response: { status, data: { message: 'Simulated error' } } }
        const client = createDataClient(() => session, fixture().store, async () => { throw error }, () => {
            cleared++
            session = { token: null, isDemo: false }
        })
        await assert.rejects(client.getPosts(), caught => caught === error)
        assert.equal(cleared, status === 401 ? 1 : 0)
        assert.equal(Boolean(session.token), status !== 401)
    }
})

test('a late 401 cannot clear a newer account, a logged-out session, or Demo Mode', async () => {
    for (const next of [
        { token: 'test-only-new-token', isDemo: false },
        { token: null, isDemo: false },
        { token: 'test-only-original-token', isDemo: true },
    ]) {
        let session = { token: 'test-only-original-token', isDemo: false }
        let fail
        const client = createDataClient(() => session, fixture().store, () => new Promise((_, reject) => { fail = reject }), () => assert.fail('Must preserve the newer session'))
        const pending = client.getPosts()
        session = next
        fail({ response: { status: 401 } })
        await assert.rejects(pending)
        assert.equal(session, next)
    }
})
