import { useAuth } from '@clerk/react'
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Loader from './Loader'

const ProtectedRoutes = () => {
  const {isLoaded, isSignedIn} = useAuth()
  const location = useLocation()

  if(!isLoaded){
    return <Loader text='Authenticating...' />
  }

  if(!isSignedIn){
    const redirectPath = encodeURIComponent(`${location.pathname}${location.search}`)
    return <Navigate to={`/login?redirect=${redirectPath}`} replace />
  }

  return <Outlet />
}

export default ProtectedRoutes
