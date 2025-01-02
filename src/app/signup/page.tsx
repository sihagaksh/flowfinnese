'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-white dark:bg-[#1c1b22]">
      <div className="lg:min-h-[60vh] min-h-[50vh] w-full max-w-md lg:max-w-lg p-8 bg-[#e7e8e96c] rounded-lg relative shadow-sm dark:bg-[#1c1917] shadow-gray-500 drop-shadow-2xl drop-s dark:shadow-gray-800 dark:drop-shadow-lg ">
        <div className="absolute top-2 left-2 text-sm font-semibold text-green-600 dark:text-rose-600">
          <span className="text-black dark:text-white">flow</span>finesse
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600 dark:text-rose-600 mt-0 lg:mt-10">Sign Up</h1>
        <form className="space-y-5">
          <div className="space-y-1.5 items-center">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Email
            </Label>
            <Input 
              id="email" 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-green-500 dark:border-rose-500 focus:border-green-500 bg-white dark:bg-[#1c1b22] focus:ring-green-500 dark:focus:ring-rose-600"
              placeholder='flowfinesse@example.com'
              required
            />
          </div>
          <div className="space-y-1.5 items-center">
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-400">
              Password
            </Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-green-500 dark:border-rose-500 dark:focus:border-rose-700 focus:border-green-700 bg-white dark:bg-[#1c1b22] focus:ring-green-500 placeholder:text-gray-400"
              placeholder='• • • • • • • •'
              required
            />
          </div>
          <Button type="submit" className="w-full bg-green-600 dark:bg-rose-600 text-white hover:bg-green-700 dark:hover:bg-rose-800">
            Sign Up
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-400" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#e5e5e6] px-2 text-gray-700 dark:bg-[#1c1917] dark:text-gray-400">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" type="button" className="w-full border-green-500 dark:border-rose-500 text-green-600 dark:text-rose-600 hover:bg-green-50 dark:hover:bg-rose-200 dark:bg-[#1c1917]">
          <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>

            Sign up with Google
          </Button>
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-green-600 dark:text-rose-600 font-semibold hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
