import { SignIn, SignUp, useUser } from '@clerk/react';
import React from 'react'
import { Navigate, useSearchParams } from 'react-router-dom';

const Login = ({mode = 'login'}) => {

    const isRegister = mode === 'register';
    const {isLoaded, isSignedIn}= useUser()
    const [searchParams] = useSearchParams();
    const redirectPath = searchParams.get('redirect');

    if(isLoaded && isSignedIn){
        return <Navigate to={redirectPath || "/dashboard"} replace />
    }

  return (
    <div className="min-h-screen w-full bg-[url('/login_bg.png')] text-slate-800 p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans">
      <div className="w-full flex justify-center py-2">
       {isRegister ? (
        <SignUp routing="path" path="/register" signInUrl='/login' fallbackRedirectUrl={redirectPath || "/dashboard"} />
       ) : (
        <SignIn routing="path" path="/login" signUpUrl='/register' fallbackRedirectUrl={redirectPath || "/dashboard"} />
       )}
      </div>
    </div>
  )
}

export default Login
