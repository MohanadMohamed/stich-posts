import { useContext } from 'react'
import { Button } from '@heroui/react'
import { useNavigate } from 'react-router-dom'
import { authContext } from '../../../context/authContext.js'
import { useDemoData } from '../../../hooks/useDemoData.js'
import { demoStore } from '../../../data/demoStore.js'

export default function DemoBanner() {
    const { exitDemo } = useContext(authContext)
    const navigate = useNavigate()
    useDemoData()
    return (
        <aside aria-label="Demo Mode" className="bg-indigo-500/15 border-b border-indigo-400/30 px-6 py-3">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-indigo-200 font-semibold">Demo Mode</p>
                    <p className="text-slate-300 text-xs">Explore as Alex Morgan. Posts, likes, and comments are saved only in this browser.</p>
                    {!demoStore.isPersistent() && <p role="alert" className="text-amber-300 text-xs">Browser storage is unavailable. Changes will last only for this visit.</p>}
                </div>
                <Button size="sm" className="bg-indigo-500 text-white" onPress={() => { exitDemo(); navigate('/login', { replace: true }) }}>Exit demo</Button>
            </div>
        </aside>
    )
}
