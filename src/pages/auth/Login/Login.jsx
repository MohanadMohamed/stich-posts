import { useContext, useEffect, useState } from 'react'
import { Alert, Input } from "@heroui/react";
import { useForm } from 'react-hook-form';
import ValidationMassege from '../../../components/shared/ValidationMessage/ValidationMassege';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../../../schemas/login.schema';
import AppButton from '../../../components/shared/AppButton/AppButton';
import NavBar from '../../../components/layout/NavBar/NavBar';
import { authContext } from '../../../context/AuthContext';

let timeOut = 0;
const API_URL = 'https://route-posts.routemisr.com/users/signin';

export default function Login() {

    const [apiError, setApiError] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const navigate = useNavigate()
    const { saveToken } = useContext(authContext);
    const {
        register,
        handleSubmit,
        formState: { isValid, errors, touchedFields, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    useEffect(() => {
        return () => {
            clearTimeout(timeOut)
        }
    }, [])

    async function onSubmitLogin(data) {
        try {
            setApiError('')
            const res = await axios.post(API_URL, data);
            if (res.error) {
                throw new Error(res.error)
            } else {
                setSuccessMsg("Login done successfully!")
                saveToken(res.data.data.token)
                timeOut = setTimeout(() => {
                    navigate('/')
                }, 1000)
            }
        } catch (error) {
            setApiError(error.response.data.message)
        }
    }

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">

            {/* Glow background effect */}
            <div className="absolute w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl top-20 left-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10">

                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mb-4">
                        <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                    <p className="text-slate-400 text-sm mt-1">Login to your account</p>
                </div>

                <form onSubmit={handleSubmit(onSubmitLogin)} className="flex flex-col gap-4">

                    {/* Email */}
                    <div>
                        <Input
                            label="Email"
                            type="email"
                            {...register('email')}
                            classNames={{
                                input: "bg-transparent text-white",
                                inputWrapper: "bg-white/5 border border-white/10 hover:border-indigo-400/50 focus-within:border-indigo-400",
                                label: "text-slate-400"
                            }}
                        />
                        <ValidationMassege field={errors.email} isTouched={touchedFields.email} />
                    </div>

                    {/* Password */}
                    <div>
                        <Input
                            label="Password"
                            type="password"
                            {...register('password')}
                            classNames={{
                                input: "bg-transparent text-white",
                                inputWrapper: "bg-white/5 border border-white/10 hover:border-indigo-400/50 focus-within:border-indigo-400",
                                label: "text-slate-400"
                            }}
                        />
                        <ValidationMassege field={errors.password} isTouched={touchedFields.password} />
                    </div>

                    {/* Alerts */}
                    {apiError && <Alert color="danger" title={apiError} />}
                    {successMsg && <Alert color="success" title={successMsg} />}

                    {/* Button */}
                    <AppButton
                        type="submit"
                        isLoading={isSubmitting}
                        isDisabled={!isValid}
                        color="primary"
                        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl py-3 transition-all duration-200 shadow-lg shadow-indigo-500/25 mt-2"
                    >
                        Login
                    </AppButton>

                    {/* Register link */}
                    <p className="text-center text-slate-400 text-sm mt-2">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                            Register Now
                        </Link>
                    </p>

                </form>
            </div>
        </div>
    );
}