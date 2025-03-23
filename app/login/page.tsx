"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // For demo purposes, we'll use hardcoded credentials
      // In a real app, this would be an API call
      if (
        (email === "admin@cassava.com" && password === "admin123") ||
        (email === "farmer@cassava.com" && password === "farmer123") ||
        (email === "transporter@cassava.com" && password === "transport123") ||
        (email === "processor@cassava.com" && password === "process123")
      ) {
        // Determine role based on email
        let role = "user"
        if (email.includes("admin")) role = "admin"
        if (email.includes("farmer")) role = "farmer"
        if (email.includes("transporter")) role = "transporter"
        if (email.includes("processor")) role = "processor"

        // Store user info in localStorage (in a real app, this would be a JWT token)
        localStorage.setItem("user", JSON.stringify({ email, role }))

        // Use a small timeout to ensure localStorage is set before navigation
        setTimeout(() => {
          // Redirect based on role
          router.push(`/dashboard/${role}`)
        }, 100)
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 dark:from-green-950/20 dark:to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-2">
            <Leaf className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Cassava LMS</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@cassava.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-sm text-green-600 hover:text-green-700">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="text-sm text-red-500 text-center">{error}</div>}

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
         
          <div className="text-center text-sm text-muted-foreground">
            <Link href="/" className="text-green-600 hover:text-green-700">
              Back to Home
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

