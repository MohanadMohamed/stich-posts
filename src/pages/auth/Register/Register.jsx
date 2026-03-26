import React, { useEffect, useState } from 'react'
import { Alert, Button, Input, Radio, RadioGroup } from "@heroui/react";
import { Controller, useForm } from 'react-hook-form';
import ValidationMassege from '../../../components/shared/ValidationMessage/ValidationMassege';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema } from '../../../schemas/register.schema';
import AppButton from '../../../components/shared/AppButton/AppButton';

const API_URL = 'https://route-posts.routemisr.com/users/signup';

let timeOut = 0;

export default function Register() {

  const [apiError, setApiError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid, errors, touchedFields, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    return () => {
      clearTimeout(timeOut)
    }
  }, [])

  async function onSubmitRegister(data) {
    try {
      setApiError('')
      const res = await axios.post(API_URL, data);
      if (res.error) {
        throw new Error(res.error)
      } else {
        setSuccessMsg("Register done successfully!")
        timeOut = setTimeout(() => {
          navigate('/auth/login')
        }, 3000)
      }
    } catch (error) {
      setApiError(error.response.data.message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-10">

      {/* Glow background effect */}
      <div className="absolute w-96 h-96 bg-indigo-500 opacity-10 rounded-full blur-3xl top-20 left-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="relative w-full max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 mb-4">
            <svg className="w-7 h-7 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-sm mt-1">Join us today, it's free!</p>
        </div>

        <form onSubmit={handleSubmit(onSubmitRegister)} className="flex flex-col gap-4">

          {/* Name & Username row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                label="Name"
                {...register('name')}
                type="text"
                classNames={{
                  input: "bg-transparent text-white",
                  inputWrapper: "bg-white/5 border border-white/10 hover:border-indigo-400/50 focus-within:border-indigo-400",
                  label: "text-slate-400"
                }}
              />
              <ValidationMassege field={errors.name} isTouched={touchedFields.name} />
            </div>
            <div>
              <Input
                label="Username"
                {...register('username')}
                type="text"
                classNames={{
                  input: "bg-transparent text-white",
                  inputWrapper: "bg-white/5 border border-white/10 hover:border-indigo-400/50 focus-within:border-indigo-400",
                  label: "text-slate-400"
                }}
              />
              <ValidationMassege field={errors.username} isTouched={touchedFields.username} />
            </div>
          </div>

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

          {/* Date of Birth */}
          <div>
            <Input
              label="Date of Birth"
              type="date"
              {...register('dateOfBirth')}
              classNames={{
                input: "bg-transparent text-white",
                inputWrapper: "bg-white/5 border border-white/10 hover:border-indigo-400/50 focus-within:border-indigo-400",
                label: "text-slate-400"
              }}
            />
            <ValidationMassege field={errors.dateOfBirth} isTouched={touchedFields.dateOfBirth} />
          </div>

          {/* Password row */}
          <div className="grid grid-cols-2 gap-3">
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
            <div>
              <Input
                label="Confirm Password"
                type="password"
                {...register('rePassword')}
                classNames={{
                  input: "bg-transparent text-white",
                  inputWrapper: "bg-white/5 border border-white/10 hover:border-indigo-400/50 focus-within:border-indigo-400",
                  label: "text-slate-400"
                }}
              />
              <ValidationMassege field={errors.rePassword} isTouched={touchedFields.rePassword} />
            </div>
          </div>

          {/* Gender */}
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <Controller
              control={control}
              name="gender"
              render={({ field }) => (
                <RadioGroup
                  label="Gender"
                  orientation="horizontal"
                  value={field.value}
                  onValueChange={field.onChange}
                  classNames={{
                    label: "text-slate-400 text-sm mb-1",
                  }}
                >
                  <Radio value="male" classNames={{ label: "text-slate-300" }}>Male</Radio>
                  <Radio value="female" classNames={{ label: "text-slate-300" }}>Female</Radio>
                </RadioGroup>
              )}
            />
            <ValidationMassege field={errors.gender} isTouched={touchedFields.gender} />
          </div>

          {/* Alerts */}
          {apiError && <Alert color="danger" title={apiError} />}
          {successMsg && <Alert color="success" title={successMsg} />}

          {/* Buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <AppButton
              type="submit"
              isLoading={isSubmitting}
              isDisabled={!isValid}
              color="primary"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl py-3 transition-all duration-200 shadow-lg shadow-indigo-500/25"
            >
              Create Account
            </AppButton>
            <AppButton
              type="reset"
              color="danger"
              className="w-full rounded-xl py-3"
            >
              Reset
            </AppButton>
          </div>

          {/* Login link */}
          <p className="text-center text-slate-400 text-sm mt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Login Now
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}