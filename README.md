# 🔗 Stich Posts

A modern social media web application built with React, featuring a clean dark UI and real-time interactions.

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

## ✨ Features

- 🔐 **Authentication** — Register & Login with JWT token management
- 🏠 **Home Feed** — Browse posts from the community in real-time
- ✍️ **Create Posts** — Share your thoughts with text and image support
- 💬 **Comments** — Facebook-style comments with live updates
- ❤️ **Likes** — Like/unlike posts instantly
- 🧪 **Demo Mode** — Explore sample posts and a profile without an account
- 🔒 **Protected Routes** — Support signed-in sessions and isolated local demos
- 📱 **Responsive Design** — Fully responsive across all screen sizes
- 🌙 **Dark Theme** — Sleek dark UI with glass morphism effects

## 🛠️ Tech Stack

| Technology          | Purpose                 |
| ------------------- | ----------------------- |
| **React 18**        | UI Library              |
| **React Router v6** | Client-side routing     |
| **Tailwind CSS**    | Utility-first styling   |
| **HeroUI**          | Component library       |
| **Axios**           | HTTP requests           |
| **React Hook Form** | Form management         |
| **Zod**             | Schema validation       |
| **Context API**     | Global state management |

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MohanadMohamed/stich-posts.git

# Navigate to the project directory
cd stich-posts

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be running at `http://localhost:5173`

## Demo Mode

Select **Try Demo** on `/login` to explore as Alex Morgan. Create text posts,
like/unlike posts, and add comments in the feed or post-details screen. The
profile shows Alex's posts, including new ones. The **Demo Mode** banner stays
visible throughout the demo and provides **Exit demo**.

Demo data is fictional and stored under `stich.demoData.v1` in localStorage.
`stich.demoMode` preserves the active mode across refreshes, including direct
visits to `/profile` and `/posts/:postId`. Exiting keeps demo content for the next
visit and returns guests to Login. A pre-existing real session, if present, is
preserved and resumes on exit. Demo data never becomes part of that account.
To start over, remove `stich.demoData.v1` from browser storage and reload.

The demo uses the same components as the signed-in app. `src/data/client.js`
selects the demo store before constructing any authenticated request. All new
application data operations should go through that client. `src/data/session.js`
is the shared source of truth for route guards and request authorization;
Demo Mode takes precedence over any stored token. No credentials or backend
changes are needed.

The demo store validates saved data and reseeds corrupt or outdated snapshots.
If saving fails, interactions continue in memory and the banner reports that
changes will not survive a reload. Browser storage must be enabled to persist
the demo session. Existing placeholder controls (edit/delete/share/report and
comment likes/replies) are disabled in the demo. Signed-in post likes retain
their existing optimistic, component-local behavior.

### Verification

```bash
npm test
npm run lint
npm run build
```

The tests cover demo persistence, data validation, missing posts, blank inputs,
storage failures, session transitions, zero network calls in demo mode (even
with a stored token), and the authenticated request contracts.

Browser smoke check: open Login, enter the demo, create a post, like it, add a
comment, open its details, refresh, then visit Profile. Check that the post,
like, and comment persist. Exit the demo and confirm protected URLs redirect
to Login. Re-entering the demo should restore your local changes.

## 🔑 Environment

This project uses the [Route Posts API](https://route-posts.routemisr.com) for backend services.

### Signup and login

The API base URL is shared in `src/data/apiConfig.js`. `src/data/authClient.js`
sends public JSON requests to `/users/signup` and `/users/signin`, handles the
API's `success` / `message` / `data` response envelope, and blocks auth requests
while Demo Mode is active. Signup sends only `name`, `username`, `email`,
`password`, `rePassword`, `dateOfBirth`, and `gender`.

Signup accepts full names and mixed-case usernames, matching the
[official signup example](https://documenter.getpostman.com/view/5709532/2sBXcBnNAq).
Dates stay as valid `YYYY-MM-DD` strings; the previous year-only age cutoff
was not part of the documented contract. The form validates as fields change,
requires matching passwords, and resets through React Hook Form.

Successful signup signs the visitor in and redirects to `/`. Both auth flows
save the returned token under `userToken` and basic profile fields under
`userData`, clear the demo flag, and restore the session after refresh.
Passwords are never cached. Logout removes both stored token and profile.
HTTP 400/409 responses, network failures, and incomplete success responses
produce readable errors without creating a local authenticated session.

Auth regression tests use mocked responses only; they do not create accounts.

## 📸 Screenshots

> Coming soon

## 👨‍💻 Author

**Mohanad**

- GitHub: [@Mohanad](https://github.com/MohanadMohamed)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
