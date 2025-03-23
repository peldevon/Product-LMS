"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, BarChart2, CheckCircle, Leaf, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function LandingPage() {
  // Add smooth scrolling for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest("a")

      if (anchor && anchor.hash && anchor.hash.startsWith("#")) {
        e.preventDefault()
        const id = anchor.hash.substring(1)
        const element = document.getElementById(id)

        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80, // Offset for header
            behavior: "smooth",
          })
        }
      }
    }

    document.addEventListener("click", handleAnchorClick)
    return () => document.removeEventListener("click", handleAnchorClick)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-green-600" />
            <span className="text-xl font-bold">Cassava LMS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Benefits
            </Link>
            <Link href="#roles" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              User Roles
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/134.jpg-3AHA1vg1CeTHzX5HxX0bTlJbpCD6Cy.jpeg"
            alt="Agricultural field at sunset"
            fill
            className="object-cover"
            priority
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container relative z-10 px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Streamline Your Cassava Supply Chain
                </h1>
                <p className="max-w-[600px] text-gray-200 md:text-xl">
                  Our comprehensive Logistics Management System connects farmers, transporters, and processors in one
                  seamless platform.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Start Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative h-[450px] w-[450px]">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-full" />
                <div className="relative h-full w-full p-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/64585.jpg-IeuQIv3YkJ7gjL1Nhr6RfxbpF5dhzx.jpeg"
                    alt="Modern greenhouse worker with fresh produce"
                    fill
                    className="object-cover rounded-full"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm dark:bg-green-800">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Comprehensive Supply Chain Management
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers end-to-end visibility and control over your entire cassava supply chain.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Inventory Management</h3>
              <p className="text-center text-muted-foreground">
                Real-time tracking of cassava inventory with quality monitoring and batch tracking.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Truck className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Transportation Management</h3>
              <p className="text-center text-muted-foreground">
                Route optimization, delivery tracking, and efficient logistics coordination.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <BarChart2 className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Analytics & Reporting</h3>
              <p className="text-center text-muted-foreground">
                Comprehensive data analysis and reporting for informed decision-making.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Role-Based Access</h3>
              <p className="text-center text-muted-foreground">
                Secure, role-specific access for farmers, transporters, processors, and administrators.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Quality Control</h3>
              <p className="text-center text-muted-foreground">
                Maintain high-quality standards throughout the supply chain with quality tracking.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <ArrowRight className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Order Management</h3>
              <p className="text-center text-muted-foreground">
                Streamlined order processing from request to delivery with real-time tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-12 md:py-24 lg:py-32 bg-green-50 dark:bg-green-950/10">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm dark:bg-green-800">Benefits</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Why Choose Our Logistics Management System?
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform offers numerous advantages for all stakeholders in the cassava supply chain.
              </p>
            </div>
          </div>
          <div className="grid gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-200" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Increased Efficiency</h3>
                    <p className="text-muted-foreground">
                      Streamline operations and reduce manual processes, saving time and resources.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-200" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Enhanced Visibility</h3>
                    <p className="text-muted-foreground">
                      Gain real-time insights into your entire supply chain from farm to processing.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-200" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Reduced Costs</h3>
                    <p className="text-muted-foreground">
                      Optimize transportation routes and inventory management to minimize expenses.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <ul className="grid gap-6">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-200" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Improved Quality Control</h3>
                    <p className="text-muted-foreground">
                      Maintain consistent quality standards throughout the supply chain.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-200" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Data-Driven Decisions</h3>
                    <p className="text-muted-foreground">
                      Leverage analytics and reporting to make informed business decisions.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-green-100 p-1 dark:bg-green-800">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-200" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold">Seamless Collaboration</h3>
                    <p className="text-muted-foreground">
                      Connect all stakeholders on a single platform for better communication and coordination.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section id="roles" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm dark:bg-green-800">User Roles</div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Tailored Solutions for Every Stakeholder
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our platform provides specialized features for each role in the cassava supply chain.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2">
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Leaf className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Farmers</h3>
              <ul className="mt-2 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Manage cassava inventory</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Request transportation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Track sales and deliveries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Monitor quality metrics</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Truck className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Transporters</h3>
              <ul className="mt-2 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Accept delivery assignments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Optimize delivery routes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Track shipments in real-time</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Manage delivery schedules</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <BarChart2 className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Processors</h3>
              <ul className="mt-2 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Order raw cassava materials</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Track incoming shipments</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Manage warehouse storage</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Monitor processing operations</span>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-800">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-200" />
              </div>
              <h3 className="text-xl font-bold">Administrators</h3>
              <ul className="mt-2 space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Oversee all operations</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Manage user accounts and roles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Generate comprehensive reports</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Analyze system-wide metrics</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated to point to registration */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-green-600 dark:bg-green-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Ready to Transform Your Cassava Supply Chain?
              </h2>
              <p className="max-w-[600px] text-white/80 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started with our comprehensive Logistics Management System today.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="bg-white text-green-600 hover:bg-white/90">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <p className="text-sm text-muted-foreground">© 2023 Cassava LMS. All rights reserved.</p>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

