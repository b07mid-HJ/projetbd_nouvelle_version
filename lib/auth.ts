// Authentication utility functions

// Get a cookie value by name
export function getCookie(name: string): string | undefined {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return undefined
}

// Set a cookie with a given name, value and expiration
export function setCookie(name: string, value: string, days: number = 7) {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`
}

// Delete a cookie by name
export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getCookie('userId')
}

// Get current user role
export function getUserRole(): string | undefined {
  return getCookie('userRole')
}

// Get current user ID
export function getUserId(): string | undefined {
  return getCookie('userId')
}

// Get current username
export function getUserName(): string | undefined {
  return getCookie('userName')
}

// Logout user by clearing all auth cookies
export function logout() {
  deleteCookie('userId')
  deleteCookie('userRole')
  deleteCookie('userName')
}