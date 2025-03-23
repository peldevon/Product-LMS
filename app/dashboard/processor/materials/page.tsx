"use client"

import type React from "react"

import { useState } from "react"
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { qualityData } from "@/lib/chart-data"

// Colors for the pie chart
const COLORS = ["#00C49F", "#FFBB28", "#FF8042"]

// Sample materials data
const materials = [
  {
    id: 1,
    batchId: "RM-1001",
    supplier: "Farm A",
    quantity: 1500,
    quality: "Grade A",
    receivedDate: "2023-10-28",
    status: "Available",
  },
  {
    id: 2,
    batchId: "RM-1002",
    supplier: "Farm B",
    quantity: 2000,
    quality: "Grade B",
    receivedDate: "2023-10-30",
    status: "Available",
  },
  {
    id: 3,
    batchId: "RM-1003",
    supplier: "Farm C",
    quantity: 1200,
    quality: "Grade A",
    receivedDate: "2023-11-02",
    status: "In Processing",
  },
  {
    id: 4,
    batchId: "RM-1004",
    supplier: "Farm D",
    quantity: 800,
    quality: "Grade A",
    receivedDate: "2023-11-03",
    status: "Available",
  },
  {
    id: 5,
    batchId: "RM-1005",
    supplier: "Farm A",
    quantity: 1000,
    quality: "Grade B",
    receivedDate: "2023-11-04",
    status: "Available",
  },
]

export default function ProcessorMaterialsPage() {
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [newOrder, setNewOrder] = useState({
    supplier: "",
    quantity: "",
    quality: "",
    deliveryDate: "",
  })

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send data to an API
    setShowOrderForm(false)
    // Reset form
    setNewOrder({
      supplier: "",
      quantity: "",
      quality: "",
      deliveryDate: "",
    })
    // Show success message
    alert("Order submitted successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Raw Materials Management</h1>
        <Button onClick={() => setShowOrderForm(!showOrderForm)}>{showOrderForm ? "Cancel" : "Order Materials"}</Button>
      </div>

      {showOrderForm && (
        <Card>
          <CardHeader>
            <CardTitle>Order Raw Materials</CardTitle>
            <CardDescription>Place an order for new cassava raw materials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOrderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select
                    value={newOrder.supplier}
                    onValueChange={(value) => setNewOrder({ ...newOrder, supplier: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Farm A">Farm A</SelectItem>
                      <SelectItem value="Farm B">Farm B</SelectItem>
                      <SelectItem value="Farm C">Farm C</SelectItem>
                      <SelectItem value="Farm D">Farm D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newOrder.quantity}
                    onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                    placeholder="e.g., 1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality Grade</Label>
                  <Select
                    value={newOrder.quality}
                    onValueChange={(value) => setNewOrder({ ...newOrder, quality: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade A">Grade A</SelectItem>
                      <SelectItem value="Grade B">Grade B</SelectItem>
                      <SelectItem value="Grade C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Requested Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={newOrder.deliveryDate}
                    onChange={(e) => setNewOrder({ ...newOrder, deliveryDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Submit Order
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Materials Overview</CardTitle>
            <CardDescription>Current raw materials by quality grade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {qualityData.map((entry, index) => (
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
            <CardTitle>Materials Summary</CardTitle>
            <CardDescription>Quick overview of your current stock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Raw Materials:</span>
                <span className="text-lg font-bold">6,500 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Grade A:</span>
                <span className="text-lg font-bold">3,500 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Grade B:</span>
                <span className="text-lg font-bold">3,000 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">In Processing:</span>
                <span className="text-lg font-bold">1,200 kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Available:</span>
                <span className="text-lg font-bold">5,300 kg</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raw Materials Inventory</CardTitle>
          <CardDescription>Detailed list of all raw material batches</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials.map((material) => (
                <TableRow key={material.id}>
                  <TableCell className="font-medium">{material.batchId}</TableCell>
                  <TableCell>{material.supplier}</TableCell>
                  <TableCell>{material.quantity}</TableCell>
                  <TableCell>{material.quality}</TableCell>
                  <TableCell>{material.receivedDate}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        material.status === "Available" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {material.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                      {material.status === "Available" && (
                        <Button variant="outline" size="sm">
                          Process
                        </Button>
                      )}
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
          <CardTitle>Incoming Orders</CardTitle>
          <CardDescription>Raw material orders that are scheduled for delivery</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Expected Delivery</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">ORD-2001</TableCell>
                <TableCell>Farm A</TableCell>
                <TableCell>1500</TableCell>
                <TableCell>Grade A</TableCell>
                <TableCell>2023-11-01</TableCell>
                <TableCell>2023-11-05</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">In Transit</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ORD-2002</TableCell>
                <TableCell>Farm B</TableCell>
                <TableCell>2000</TableCell>
                <TableCell>Grade B</TableCell>
                <TableCell>2023-11-02</TableCell>
                <TableCell>2023-11-06</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Confirmed</span>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ORD-2003</TableCell>
                <TableCell>Farm C</TableCell>
                <TableCell>1200</TableCell>
                <TableCell>Grade A</TableCell>
                <TableCell>2023-11-03</TableCell>
                <TableCell>2023-11-07</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">Processing</span>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

