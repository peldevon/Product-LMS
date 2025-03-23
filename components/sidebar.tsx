"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Box, Home, Leaf, LogOut, Settings, ShoppingCart, Truck, Users, Warehouse } from "lucide-react"

interface SidebarProps {
  userRole: string
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  // Update the handleLogout function to use a safer approach

  const handleLogout = () => {
    localStorage.removeItem("user")
    // Use router for navigation instead of directly manipulating window.location
    setTimeout(() => {
      window.location.href = "/login"
    }, 100)
  }

  // Define navigation items based on user role
  const getNavItems = () => {
    const commonItems = [
      {
        title: "Dashboard",
        href: `/dashboard/${userRole}`,
        icon: Home,
      },
      {
        title: "Settings",
        href: `/dashboard/${userRole}/settings`,
        icon: Settings,
      },
    ]

    const roleSpecificItems = {
      admin: [
        {
          title: "Users",
          href: "/dashboard/admin/users",
          icon: Users,
        },
        {
          title: "Inventory",
          href: "/dashboard/admin/inventory",
          icon: Box,
        },
        {
          title: "Transportation",
          href: "/dashboard/admin/transportation",
          icon: Truck,
        },
        {
          title: "Warehouse",
          href: "/dashboard/admin/warehouse",
          icon: Warehouse,
        },
        {
          title: "Orders",
          href: "/dashboard/admin/orders",
          icon: ShoppingCart,
        },
        {
          title: "Analytics",
          href: "/dashboard/admin/analytics",
          icon: BarChart2,
        },
      ],
      farmer: [
        {
          title: "Inventory",
          href: "/dashboard/farmer/inventory",
          icon: Box,
        },
        {
          title: "Transportation",
          href: "/dashboard/farmer/transportation",
          icon: Truck,
        },
        {
          title: "Sales",
          href: "/dashboard/farmer/sales",
          icon: ShoppingCart,
        },
      ],
      transporter: [
        {
          title: "Deliveries",
          href: "/dashboard/transporter/deliveries",
          icon: Truck,
        },
        {
          title: "Routes",
          href: "/dashboard/transporter/routes",
          icon: BarChart2,
        },
      ],
      processor: [
        {
          title: "Raw Materials",
          href: "/dashboard/processor/materials",
          icon: Box,
        },
        {
          title: "Warehouse",
          href: "/dashboard/processor/warehouse",
          icon: Warehouse,
        },
        {
          title: "Processing",
          href: "/dashboard/processor/processing",
          icon: BarChart2,
        },
        {
          title: "Orders",
          href: "/dashboard/processor/orders",
          icon: ShoppingCart,
        },
      ],
    }

    return [...commonItems, ...(roleSpecificItems[userRole as keyof typeof roleSpecificItems] || [])]
  }

  const navItems = getNavItems()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-gray-800">
      <div className="flex h-14 items-center border-b px-4">
        <Link href={`/dashboard/${userRole}`} className="flex items-center gap-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <span className="text-lg font-semibold">Cassava LMS</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-green-900 dark:hover:text-green-50 ${
                pathname === item.href
                  ? "bg-green-100 text-green-900 dark:bg-green-800 dark:text-green-50"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-red-900 dark:text-gray-400 dark:hover:text-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

