import { createBrowserRouter } from 'react-router-dom'
import Register from '../pages/auth/Register/Register.jsx'
import Login from '../pages/auth/Login/Login.jsx'
import AuthLayout from '../layouts/AuthLayout/AuthLayout.jsx'
import UserLayout from '../layouts/UserLayout/UserLayout.jsx'
import Home from '../pages/Home/Home.jsx'
import Profile from '../pages/Profile/Profile.jsx'
import NotFound from '../pages/NotFound/NotFound.jsx'
import ProtectedAuthRoutes from './ProtectedAuthRoutes.jsx'
import ProtectedRoutes from './ProtectedRoutes.jsx'
import PostDetails from '../components/layout/Posts/PostDetails.jsx'

 
export const router = createBrowserRouter([
    {
        path: '',
        element: <UserLayout />,
        children: [
            { index: true, element: <ProtectedRoutes><Home /></ProtectedRoutes> },
            { path: 'profile', element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
            { path: 'posts/:postId', element: <ProtectedRoutes><PostDetails /></ProtectedRoutes> }, 
            { path: '*', element: <ProtectedRoutes><NotFound /></ProtectedRoutes> },
        ],
    },
    {
        path: '',
        element: <AuthLayout />,
        children: [
            { path: 'login', element: <ProtectedAuthRoutes><Login /></ProtectedAuthRoutes> },
            { path: 'register', element: <ProtectedAuthRoutes><Register /></ProtectedAuthRoutes> },
        ],
    },
])
 