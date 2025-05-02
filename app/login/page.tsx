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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="w-full max-w-md px-4 py-8 sm:px-0 mx-auto flex flex-col items-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20 overflow-hidden rounded-full bg-primary/10 flex items-center justify-center">

          </div>
        </div>
        
        <Card className="w-full border-muted/30 shadow-lg transition-all duration-300 hover:shadow-xl">
          <CardHeader className="space-y-2 pb-2">
            <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Training Center Management
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your username"
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
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  placeholder="Enter your password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full transition-all duration-300 hover:bg-primary/90 font-medium text-base py-5" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </span>
                ) : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Training Center. All rights reserved.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}