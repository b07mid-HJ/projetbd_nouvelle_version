"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { loginUser } from "@/lib/actions"
import { getUserId } from "@/lib/auth"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  
  // Authentication check is now handled by middleware

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TEMPORARY SOLUTION: Add a development/testing bypass option
      // This allows testing the frontend without the backend running
      if (process.env.NODE_ENV === 'development' && username === 'admin' && password === 'admin') {
        // Set mock user data for testing
        document.cookie = `userId=test-user-id; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
        document.cookie = `userRole=admin; path=/; max-age=${60 * 60 * 24 * 7}`
        document.cookie = `userName=${username}; path=/; max-age=${60 * 60 * 24 * 7}`
        
        toast({
          title: "Development login",
          description: "Logged in with development bypass. Backend connection not required.",
        })
        
        router.push("/")
        router.refresh()
        return
      }
      
      // Use the loginUser action from lib/actions.ts
      const result = await loginUser(username, password)
      
      if (!result.success) {
        throw new Error(result.error)
      }
      
      const data = result.data
      console.log(data)
      // Store user info in cookies
      document.cookie = `userId=${data.id}; path=/; max-age=${60 * 60 * 24 * 7}` // 1 week
      document.cookie = `userRole=${data.role?.nom || ''}; path=/; max-age=${60 * 60 * 24 * 7}`
      document.cookie = `userName=${username}; path=/; max-age=${60 * 60 * 24 * 7}`
      
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })

      // Redirect to dashboard
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Invalid username or password. Please check your credentials or verify that the backend server is running.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Training Center Management</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access the system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={isLoading}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}