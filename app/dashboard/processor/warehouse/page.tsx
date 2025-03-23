"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { warehouseData } from "@/lib/chart-data"

// Sample storage locations data
const storageLocations = [
  {
    id: 1,
    locationId: "A-01",
    type: "Raw Materials",
    capacity: 5000,
    used: 3500,
    available: 1500,
    items: [
      { batchId: "RM-1001", quantity: 1500 },
      { batchId: "RM-1002", quantity: 2000 },
    ],
  },
  {
    id: 2,
    locationId: "A-02",
    type: "Raw Materials",
    capacity: 5000,
    used: 3000,
    available: 2000,
    items: [
      { batchId: "RM-1004", quantity: 800 },
      { batchId: "RM-1005", quantity: 1000 },
      { batchId: "RM-1006", quantity: 1200 },
    ],
  },
  {
    id: 3,
    locationId: "B-01",
    type: "Processed Products",
    capacity: 3000,
    used: 1800,
    available: 1200,
    items: [
      { batchId: "PP-1001", quantity: 800 },
      { batchId: "PP-1002", quantity: 1000 },
    ],
  },
  {
    id: 4,
    locationId: "B-02",
    type: "Processed Products",
    capacity: 3000,
    used: 2200,
    available: 800,
    items: [
      { batchId: "PP-1003", quantity: 1200 },
      { batchId: "PP-1004", quantity: 1000 },
    ],
  },
  {
    id: 5,
    locationId: "C-01",
    type: "Packaging Materials",
    capacity: 2000,
    used: 1200,
    available: 800,
    items: [
      { batchId: "PM-1001", quantity: 500 },
      { batchId: "PM-1002", quantity: 700 },
    ],
  },
]

export default function ProcessorWarehousePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Warehouse Management</h1>
      <p className="text-muted-foreground">Manage and monitor your warehouse storage</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18,000 kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Used Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">11,700 kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,300 kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Utilization</CardTitle>
            <CardDescription>Capacity usage by warehouse location</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={warehouseData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="used" stackId="a" fill="#10b981" name="Used Space (kg)" />
                  <Bar dataKey="capacity" stackId="a" fill="#f59e0b" name="Total Capacity (kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Storage Distribution</CardTitle>
            <CardDescription>Storage allocation by product type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Raw Materials</span>
                  <span className="text-sm font-medium">6,500 kg (56%)</span>
                </div>
                <Progress value={56} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Processed Products</span>
                  <span className="text-sm font-medium">4,000 kg (34%)</span>
                </div>
                <Progress value={34} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Packaging Materials</span>
                  <span className="text-sm font-medium">1,200 kg (10%)</span>
                </div>
                <Progress value={10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Storage Locations</CardTitle>
          <CardDescription>Detailed information about warehouse storage locations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity (kg)</TableHead>
                <TableHead>Used (kg)</TableHead>
                <TableHead>Available (kg)</TableHead>
                <TableHead>Utilization</TableHead>
                <TableHead>Items</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storageLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.locationId}</TableCell>
                  <TableCell>{location.type}</TableCell>
                  <TableCell>{location.capacity}</TableCell>
                  <TableCell>{location.used}</TableCell>
                  <TableCell>{location.available}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(location.used / location.capacity) * 100} className="h-2 w-24" />
                      <span className="text-xs">{Math.round((location.used / location.capacity) * 100)}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">
                      {location.items.map((item, index) => (
                        <span key={index} className="block">
                          {item.batchId}: {item.quantity} kg
                        </span>
                      ))}
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
          <CardTitle>Warehouse Layout</CardTitle>
          <CardDescription>Visual representation of the warehouse</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-500">Interactive Warehouse Map</p>
              <p className="text-sm text-gray-400">Showing storage locations and current utilization</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

