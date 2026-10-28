import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { authContext } from '../context/authContext.js'

export default function ProtectedRoutes({ children }) {
    const { hasAccess } = useContext(authContext)
    return hasAccess ? children : <Navigate to="/login" replace />
}
