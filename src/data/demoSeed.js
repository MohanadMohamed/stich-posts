export function createDemoSeed() {
    const users = [
        { _id: 'demo-visitor', name: 'Alex Morgan', username: 'alexexplores', email: 'alex@example.com', bio: 'Curious maker, weekend hiker, and coffee enthusiast. Trying something new every day.', location: 'Cairo, Egypt' },
        { _id: 'demo-nour', name: 'Nour Hassan', username: 'nourcreates', email: 'nour@example.com', bio: 'Product designer sharing sketches, small wins, and everyday inspiration.', location: 'Alexandria, Egypt' },
        { _id: 'demo-omar', name: 'Omar Farouk', username: 'omarbuilds', email: 'omar@example.com', bio: 'Frontend developer. Learning in public and building for the web.', location: 'Cairo, Egypt' },
        { _id: 'demo-maya', name: 'Maya Chen', username: 'mayaruns', email: 'maya@example.com', bio: 'Morning runs, good books, and exploring new neighborhoods.', location: 'London, UK' },
    ]
    const ago = hours => new Date(Date.now() - hours * 3600000).toISOString()
    const makeComment = (id, user, content, hours) => ({ _id: id, commentCreator: user, content, createdAt: ago(hours) })
    const posts = [
        { _id: 'demo-post-design', user: users[1], body: 'Spent the morning sketching ideas at my favorite café. Stepping away from the screen always helps me see a design problem differently. What gets your creativity going?', createdAt: ago(2), likesCount: 24, comments: [makeComment('demo-comment-1', users[2], 'A walk without headphones usually does it for me. The best ideas show up when I stop chasing them!', 1)] },
        { _id: 'demo-post-build', user: users[2], body: 'Small win today: shipped my first accessible navigation menu! Keyboard support and clear focus states made the whole experience better. Next up: testing on mobile.', createdAt: ago(5), likesCount: 18, comments: [makeComment('demo-comment-2', users[1], 'Love this. Accessibility belongs in the first sketch, not the final checklist.', 4), makeComment('demo-comment-3', users[3], 'Nice work! Testing with just a keyboard taught me so much.', 3)] },
        { _id: 'demo-post-weekend', user: users[0], body: 'Planning a quiet weekend: a sunrise walk by the Nile, a new book, and absolutely no alarm on Saturday. What are you looking forward to?', createdAt: ago(12), likesCount: 12, comments: [makeComment('demo-comment-4', users[3], 'A long run followed by the biggest breakfast I can find.', 10)] },
        { _id: 'demo-post-books', user: users[3], body: 'Started a tiny book swap with the neighbors. Leave one, take one, write a note inside. Already found a new favorite and met two people from our street.', createdAt: ago(24), likesCount: 31, comments: [] },
    ].map(post => ({ ...post, privacy: 'public', liked: false, commentsCount: post.comments.length, topComment: post.comments[0] ?? null }))
    return { version: 1, currentUserId: users[0]._id, users, posts }
}
