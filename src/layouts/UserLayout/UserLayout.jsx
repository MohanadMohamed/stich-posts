import { Navbar } from '@heroui/react'
import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar/NavBar'
import Footer from '../../components/layout/Footer/Footer'

export default function UserLayout() {
    return (
        <>
            <NavBar />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
