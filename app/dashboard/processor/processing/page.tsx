"use client"

import type React from "react"

import { useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { processingData } from "@/lib/chart-data"

// Sample processing batches
const processingBatches = [
  {
    id: 1,
    batchId: "PB-1001",
    product: "Cassava Flour",
    rawMaterial: "RM-1003",
    quantity: 1200,
    startDate: "2023-11-01",
    endDate: "2023-11-03",
    status: "In Progress",
    progress: 65,
  },
  {
    id: 2,
    batchId: "PB-1002",
    product: "Cassava Starch",
    rawMaterial: "RM-0998",
    quantity: 800,
    startDate: "2023-10-30",
    endDate: "2023-11-02",
    status: "Completed",
    progress: 100,
  },
  {
    id: 3,
    batchId: "PB-1003",
    product: "Cassava Chips",
    rawMaterial: "RM-0999",
    quantity: 500,
    startDate: "2023-10-29",
    endDate: "2023-10-31",
    status: "Completed",
    progress: 100,
  },
  {
    id: 4,
    batchId: "PB-1004",
    product: "Cassava Flour",
    rawMaterial: "RM-1000",
    quantity: 1000,
    startDate: "2023-10-28",
    endDate: "2023-10-30",
    status: "Completed",
    progress: 100,
  },
]

// Sample completed batches
const completedBatches = processingBatches.filter((batch) => batch.status === "Completed")
const activeBatches = processingBatches.filter((batch) => batch.status === "In Progress")

// Sample efficiency data
const efficiencyData = [
  { product: "Cassava Flour", efficiency: 85, output: 3200 },
  { product: "Cassava Starch", efficiency: 78, output: 2400 },
  { product: "Cassava Chips", efficiency: 92, output: 1800 },
]

export default function ProcessorProcessingPage() {
  const [showNewBatchForm, setShowNewBatchForm] = useState(false)
  const [newBatch, setNewBatch] = useState({
    product: "",
    rawMaterial: "",
    quantity: "",
    startDate: "",
    endDate: "",
  })

  const handleNewBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send data to an API
    setShowNewBatchForm(false)
    // Reset form
    setNewBatch({
      product: "",
      rawMaterial: "",
      quantity: "",
      startDate: "",
      endDate: "",
    })
    // Show success message
    alert("New processing batch created successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Processing Operations</h1>
        <Button onClick={() => setShowNewBatchForm(!showNewBatchForm)}>
          {showNewBatchForm ? "Cancel" : "New Processing Batch"}
        </Button>
      </div>

      {showNewBatchForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Processing Batch</CardTitle>
            <CardDescription>Set up a new batch for processing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewBatchSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product Type</Label>
                  <Select
                    value={newBatch.product}
                    onValueChange={(value) => setNewBatch({ ...newBatch, product: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cassava Flour">Cassava Flour</SelectItem>
                      <SelectItem value="Cassava Starch">Cassava Starch</SelectItem>
                      <SelectItem value="Cassava Chips">Cassava Chips</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rawMaterial">Raw Material Batch</Label>
                  <Select
                    value={newBatch.rawMaterial}
                    onValueChange={(value) => setNewBatch({ ...newBatch, rawMaterial: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select raw material batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RM-1001">RM-1001 (1500kg)</SelectItem>
                      <SelectItem value="RM-1002">RM-1002 (2000kg)</SelectItem>
                      <SelectItem value="RM-1004">RM-1004 (800kg)</SelectItem>
                      <SelectItem value="RM-1005">RM-1005 (1000kg)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newBatch.quantity}
                    onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                    placeholder="e.g., 1000"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newBatch.startDate}
                    onChange={(e) => setNewBatch({ ...newBatch, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Expected End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newBatch.endDate}
                    onChange={(e) => setNewBatch({ ...newBatch, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Processing Batch
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Processing Overview</CardTitle>
            <CardDescription>Monthly input vs output (kg)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={processingData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="input" stroke="#8884d8" name="Raw Material Input" />
                  <Line type="monotone" dataKey="output" stroke="#10b981" name="Processed Output" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Processing Efficiency</CardTitle>
            <CardDescription>Efficiency by product type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={efficiencyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="product" />
                  <YAxis />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "efficiency" ? `${value}%` : `${value} kg`,
                      name === "efficiency" ? "Efficiency" : "Output",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="efficiency" fill="#10b981" name="Efficiency (%)" />
                  <Bar dataKey="output" fill="#8884d8" name="Output (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Batches</TabsTrigger>
          <TabsTrigger value="completed">Completed Batches</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Processing Batches</CardTitle>
              <CardDescription>Currently active processing operations</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Raw Material</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.batchId}</TableCell>
                      <TableCell>{batch.product}</TableCell>
                      <TableCell>{batch.rawMaterial}</TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>{batch.startDate}</TableCell>
                      <TableCell>{batch.endDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${batch.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{batch.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Update
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Processing Batches</CardTitle>
              <CardDescription>Processing operations that have been completed</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Raw Material</TableHead>
                    <TableHead>Quantity (kg)</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedBatches.map((batch) => (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">{batch.batchId}</TableCell>
                      <TableCell>{batch.product}</TableCell>
                      <TableCell>{batch.rawMaterial}</TableCell>
                      <TableCell>{batch.quantity}</TableCell>
                      <TableCell>{batch.startDate}</TableCell>
                      <TableCell>{batch.endDate}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{batch.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

