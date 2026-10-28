import { useContext } from 'react'
import { authContext } from '../../context/authContext.js'
import DemoBanner from '../../components/layout/DemoBanner/DemoBanner.jsx'
import { Outlet } from 'react-router-dom'
import NavBar from '../../components/layout/NavBar/NavBar'
import Footer from '../../components/layout/Footer/Footer'

export default function UserLayout() {
    const { isDemo, token } = useContext(authContext)
    return (
        <>
            <NavBar />
            {isDemo && <DemoBanner />}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div key={isDemo ? 'demo' : token || 'guest'}><Outlet /></div>
            </main>
            <Footer />
        </>
    )
}
