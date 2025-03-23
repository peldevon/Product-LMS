"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { authenticateUser } from "@/app/actions/auth"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { storeUserData } from "@/app/lib/store-user"
import { z } from "zod"

const getRedirectPath = (role: string): string => {
  switch (role) {
    case 'Admin':
      return '/dashboard/admin'
    case 'Farmer':
      return '/dashboard/farmer'
    case 'Processor':
      return '/dashboard/processor'
    case 'Transporter':
      return '/dashboard/transporter'
    default:
      return '/dashboard'
  }
}

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const result = await authenticateUser({ email, password })
      
      if (result.success && result.user) {
        storeUserData(result.user)
        router.push(getRedirectPath(result.user.role))
      } else {
        setError(result.error || "An error occurred during login")
      }
    } catch (error) {
      setError("An unexpected error occurred")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center mb-2">
          <Link href="/" className="text-muted-foreground hover:text-primary mr-2">
            <ArrowLeft size={16} />
          </Link>
          <CardTitle className="text-2xl">Login</CardTitle>
        </div>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
              <a
                href="#"
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/auth/register"
              className="text-blue-500 hover:text-blue-700"
            >
              Sign up
            </a>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
} 