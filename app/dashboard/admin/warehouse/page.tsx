"use client"

import { MagnifyingGlassIcon, DownloadIcon } from "@radix-ui/react-icons"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// Colors for the pie chart
const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"]

// Sample warehouse data
const warehouses = [
  {
    id: 1,
    name: "Warehouse A",
    location: "Lagos",
    totalCapacity: 10000,
    usedCapacity: 6500,
    itemTypes: ["Raw Materials", "Processed Products"],
    status: "Active",
  },
  {
    id: 2,
    name: "Warehouse B",
    location: "Abuja",
    totalCapacity: 8000,
    usedCapacity: 5200,
    itemTypes: ["Raw Materials", "Packaging Materials"],
    status: "Active",
  },
  {
    id: 3,
    name: "Warehouse C",
    location: "Port Harcourt",
    totalCapacity: 12000,
    usedCapacity: 7800,
    itemTypes: ["Raw Materials", "Processed Products", "Packaging Materials"],
    status: "Active",
  },
  {
    id: 4,
    name: "Warehouse D",
    location: "Kano",
    totalCapacity: 6000,
    usedCapacity: 2400,
    itemTypes: ["Processed Products"],
    status: "Maintenance",
  },
]

// Calculate total capacity
const totalCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.totalCapacity, 0)
const totalUsedCapacity = warehouses.reduce((sum, warehouse) => sum + warehouse.usedCapacity, 0)
const overallUtilization = (totalUsedCapacity / totalCapacity) * 100

// Sample storage distribution data
const storageDistributionData = [
  { name: "Raw Materials", value: 12000 },
  { name: "Processed Products", value: 8000 },
  { name: "Packaging Materials", value: 2000 },
  { name: "Temporary Storage", value: 900 },
]

// Sample utilization data
const utilizationData = [
  { name: "Warehouse A", utilization: 65 },
  { name: "Warehouse B", utilization: 65 },
  { name: "Warehouse C", utilization: 65 },
  { name: "Warehouse D", utilization: 40 },
]

export default function AdminWarehousePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Warehouse Management</h1>
      <p className="text-muted-foreground">Monitor and manage warehouse operations across all locations</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toLocaleString()} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Used Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsedCapacity.toLocaleString()} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(totalCapacity - totalUsedCapacity).toLocaleString()} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Overall Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallUtilization.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Storage Distribution</CardTitle>
            <CardDescription>Distribution of storage by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {storageDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Utilization</CardTitle>
            <CardDescription>Capacity utilization by warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={utilizationData}
                  layout="vertical"
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value}%`, "Utilization"]} />
                  <Legend />
                  <Bar dataKey="utilization" fill="#8884d8" name="Utilization (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Warehouses</CardTitle>
          <CardDescription>All warehouse locations and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search warehouses..."
                  className="pl-8"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <DownloadIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Storage Types</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {warehouses.map((warehouse) => (
                <TableRow key={warehouse.id}>
                  <TableCell className="font-medium">{warehouse.name}</TableCell>
                  <TableCell>{warehouse.location}</TableCell>
                  <TableCell>{warehouse.totalCapacity.toLocaleString()} kg</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(warehouse.usedCapacity / warehouse.totalCapacity) * 100} className="h-2 w-24" />
                      <span className="text-xs">
                        {((warehouse.usedCapacity / warehouse.totalCapacity) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {warehouse.itemTypes.map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        warehouse.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {warehouse.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Warehouse Map</CardTitle>
          <CardDescription>Geographic distribution of warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-500">Interactive Warehouse Map</p>
              <p className="text-sm text-gray-400">Showing warehouse locations and capacity</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

