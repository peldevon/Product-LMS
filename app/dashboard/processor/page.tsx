"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { processingData } from "@/lib/chart-data"

export default function ProcessorDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Processor Dashboard</h1>
      <p className="text-muted-foreground">
        Welcome to your processor dashboard. Manage your raw materials and processing operations.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Raw Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,750 kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Incoming Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warehouse Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">65%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Processing Operations</CardTitle>
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
            <CardTitle>Incoming Shipments</CardTitle>
            <CardDescription>Expected raw material deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Shipment #1234</p>
                  <p className="text-xs text-muted-foreground">Farm A - 1500kg Grade A</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Arriving Today
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Shipment #1235</p>
                  <p className="text-xs text-muted-foreground">Farm B - 2000kg Grade B</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Tomorrow</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Shipment #1236</p>
                  <p className="text-xs text-muted-foreground">Farm C - 1200kg Grade A</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  In 2 Days
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Shipment #1237</p>
                  <p className="text-xs text-muted-foreground">Farm D - 800kg Grade A</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  In 3 Days
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Shipment #1238</p>
                  <p className="text-xs text-muted-foreground">Farm A - 1000kg Grade B</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                  In 4 Days
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Processing Efficiency</CardTitle>
            <CardDescription>Monthly processing efficiency by product type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { month: "Jan", flour: 85, starch: 78, chips: 92 },
                    { month: "Feb", flour: 87, starch: 80, chips: 91 },
                    { month: "Mar", flour: 84, starch: 82, chips: 90 },
                    { month: "Apr", flour: 83, starch: 79, chips: 93 },
                    { month: "May", flour: 86, starch: 83, chips: 94 },
                    { month: "Jun", flour: 88, starch: 85, chips: 92 },
                  ]}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}%`, "Efficiency"]} />
                  <Legend />
                  <Bar dataKey="flour" fill="#8884d8" name="Cassava Flour" />
                  <Bar dataKey="starch" fill="#10b981" name="Cassava Starch" />
                  <Bar dataKey="chips" fill="#f59e0b" name="Cassava Chips" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

