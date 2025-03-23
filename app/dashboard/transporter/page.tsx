"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { transportData } from "@/lib/chart-data"

export default function TransporterDashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Transporter Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your transporter dashboard. Manage your deliveries and routes.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245 km</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>Weekly delivery statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={transportData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#10b981" name="Completed" />
                  <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Deliveries</CardTitle>
            <CardDescription>Current deliveries in progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delivery #5678</p>
                  <p className="text-xs text-muted-foreground">Farm A to Processor B - 500kg</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  In Transit
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delivery #5679</p>
                  <p className="text-xs text-muted-foreground">Farm C to Processor A - 750kg</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">Loading</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delivery #5680</p>
                  <p className="text-xs text-muted-foreground">Farm B to Processor C - 1000kg</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Scheduled</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delivery #5681</p>
                  <p className="text-xs text-muted-foreground">Farm D to Processor B - 600kg</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  In Transit
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Delivery #5682</p>
                  <p className="text-xs text-muted-foreground">Farm A to Processor C - 450kg</p>
                </div>
                <div className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Scheduled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Map</CardTitle>
          <CardDescription>Current route and delivery locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-500">Interactive Map</p>
              <p className="text-sm text-gray-400">Showing current delivery routes and locations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

