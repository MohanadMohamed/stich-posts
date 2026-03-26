import React, { useContext } from 'react'
import {
    Navbar, NavbarBrand, NavbarContent, NavbarItem, Button,
    DropdownTrigger,
    Dropdown,
    Avatar,
    DropdownMenu,
    DropdownItem
} from "@heroui/react";
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../../../context/AuthContext';

export default function NavBar() {
    const navigate = useNavigate();
    const { token, removeToken } = useContext(authContext);

    function logOut() {
        removeToken();
        navigate('/login')
    }

    return (
        <Navbar
            className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10"
            maxWidth="xl"
        >
            {/* Brand */}
            <NavbarBrand>
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <p className="font-bold text-white text-lg tracking-tight">Stich Posts</p>
                </Link>
            </NavbarBrand>

            {/* Center Links */}
            <NavbarContent className="hidden sm:flex gap-6" justify="center">
                <NavbarItem>
                    <Link to="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                        Home
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link to="/profile" className="text-slate-400 hover:text-white transition-colors text-sm">
                        Profile
                    </Link>
                </NavbarItem>
            </NavbarContent>

            {/* Auth Buttons */}
            <NavbarContent justify="end" className="gap-2">
                {token && <NavbarItem>
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                className="transition-transform hover:scale-105"
                                classNames={{
                                    base: "border-indigo-400/50",
                                }}
                                color="secondary"
                                name="Jason Hughes"
                                size="sm"
                                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                            />
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Profile Actions"
                            variant="flat"
                            classNames={{
                                base: "bg-slate-900 border border-white/10 rounded-xl shadow-xl shadow-black/40",
                            }}
                        >
                            <DropdownItem key="profile" className="h-14 gap-2 opacity-100 cursor-default">
                                <p className="text-slate-400 text-xs">Signed in as</p>
                                <p className="text-white font-semibold text-sm">zoey@example.com</p>
                            </DropdownItem>
                            <DropdownItem key="settings" className="text-slate-300 hover:text-white">
                                My Settings
                            </DropdownItem>
                            <DropdownItem key="profile_page" className="text-slate-300 hover:text-white">
                                Profile
                            </DropdownItem>
                            <DropdownItem key="logout" color="danger" onClick={()=>logOut()} className="text-red-400 hover:text-red-300">
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </NavbarItem>}
                {!token && <><NavbarItem>
                    <Link
                        to="/login"
                        className="text-slate-400 hover:text-white transition-colors text-sm px-3 py-1.5"
                    >
                        Login
                    </Link>
                </NavbarItem>
                    <NavbarItem>
                        <Button
                            as={Link}
                            to="/register"
                            className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 rounded-lg shadow-lg shadow-indigo-500/25 transition-all"
                            size="sm"
                        >
                            Sign Up
                        </Button>
                    </NavbarItem></>}
            </NavbarContent>
        </Navbar>
    );
}