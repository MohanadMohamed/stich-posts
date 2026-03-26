
import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar/NavBar'
import Footer from '../../components/layout/Footer/Footer'

export default function AuthLayout() {
    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    )
}
