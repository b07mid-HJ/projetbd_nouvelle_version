"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCookie, getUserId, getUserRole, getUserName, logout } from '@/lib/auth'

interface AuthState {
  isAuthenticated: boolean
  userId: string | undefined
  userRole: string | undefined
  userName: string | undefined
  isLoading: boolean
  logout: () => void
}

export function useAuth(): AuthState {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState<string | undefined>()
  const [userRole, setUserRole] = useState<string | undefined>()
  const [userName, setUserName] = useState<string | undefined>()
  const router = useRouter()

  useEffect(() => {
    // Check authentication status on client side
    const id = getUserId()
    const role = getUserRole()
    const name = getUserName()
    
    setUserId(id)
    setUserRole(role)
    setUserName(name)
    setIsAuthenticated(!!id)
    setIsLoading(false)
  }, [])

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
    setUserId(undefined)
    setUserRole(undefined)
    setUserName(undefined)
    router.push('/login')
    router.refresh()
  }

  return {
    isAuthenticated,
    userId,
    userRole,
    userName,
    isLoading,
    logout: handleLogout
  }
}