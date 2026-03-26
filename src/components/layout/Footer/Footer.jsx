import React from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { authContext } from '../../../context/AuthContext'


export default function Footer() {
    const { token } = useContext(authContext)

    return (
        <footer className="bg-slate-900/80 backdrop-blur-xl border-t border-white/10 py-5 px-6">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                        <svg className="w-3 h-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-white font-bold text-sm">Stich Posts</span>
                    <span className="text-slate-500 text-xs ml-1">— Share your thoughts</span>
                </div>

                {/* Links */}
                <div className="flex items-center gap-5">
                    <Link to="/" className="text-slate-400 hover:text-white transition-colors text-xs">Home</Link>
                    <Link to="/profile" className="text-slate-400 hover:text-white transition-colors text-xs">Profile</Link>
                    
                    
                    {!token && <>
                        <Link to="/login" className="text-slate-400 hover:text-white transition-colors text-xs">Login</Link>
                        <Link to="/register" className="text-slate-400 hover:text-white transition-colors text-xs">Register</Link>
                    </>}
                </div>

                {/* Copyright */}
                <p className="text-slate-500 text-xs">
                    © {new Date().getFullYear()} Stich Posts. All rights reserved.
                </p>

            </div>
        </footer>
    )
}