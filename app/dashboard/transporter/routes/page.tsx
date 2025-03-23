"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample routes data
const routes = [
  {
    id: 1,
    routeId: "RT-1001",
    startLocation: "Farm A",
    endLocation: "Processor B",
    distance: 45,
    estimatedTime: "1h 15m",
    status: "Active",
  },
  {
    id: 2,
    routeId: "RT-1002",
    startLocation: "Farm C",
    endLocation: "Processor A",
    distance: 32,
    estimatedTime: "55m",
    status: "Active",
  },
  {
    id: 3,
    routeId: "RT-1003",
    startLocation: "Farm B",
    endLocation: "Processor C",
    distance: 67,
    estimatedTime: "1h 45m",
    status: "Active",
  },
  {
    id: 4,
    routeId: "RT-1004",
    startLocation: "Farm D",
    endLocation: "Processor B",
    distance: 28,
    estimatedTime: "45m",
    status: "Active",
  },
  {
    id: 5,
    routeId: "RT-0995",
    startLocation: "Farm B",
    endLocation: "Processor A",
    distance: 52,
    estimatedTime: "1h 25m",
    status: "Inactive",
  },
  {
    id: 6,
    routeId: "RT-0996",
    startLocation: "Farm C",
    endLocation: "Processor B",
    distance: 38,
    estimatedTime: "1h",
    status: "Inactive",
  },
]

// Filter routes by status
const activeRoutes = routes.filter((r) => r.status === "Active")
const inactiveRoutes = routes.filter((r) => r.status === "Inactive")

export default function TransporterRoutesPage() {
  const [selectedRoute, setSelectedRoute] = useState<any>(null)

  const handleViewRoute = (route: any) => {
    setSelectedRoute(route)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Routes Management</h1>
      <p className="text-muted-foreground">Manage and optimize your delivery routes</p>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Routes</TabsTrigger>
          <TabsTrigger value="inactive">Inactive Routes</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Routes</CardTitle>
              <CardDescription>Currently active delivery routes</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route ID</TableHead>
                    <TableHead>Start Location</TableHead>
                    <TableHead>End Location</TableHead>
                    <TableHead>Distance (km)</TableHead>
                    <TableHead>Est. Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.routeId}</TableCell>
                      <TableCell>{route.startLocation}</TableCell>
                      <TableCell>{route.endLocation}</TableCell>
                      <TableCell>{route.distance}</TableCell>
                      <TableCell>{route.estimatedTime}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{route.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewRoute(route)}>
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Deactivate
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
        <TabsContent value="inactive">
          <Card>
            <CardHeader>
              <CardTitle>Inactive Routes</CardTitle>
              <CardDescription>Previously used routes that are currently inactive</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Route ID</TableHead>
                    <TableHead>Start Location</TableHead>
                    <TableHead>End Location</TableHead>
                    <TableHead>Distance (km)</TableHead>
                    <TableHead>Est. Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inactiveRoutes.map((route) => (
                    <TableRow key={route.id}>
                      <TableCell className="font-medium">{route.routeId}</TableCell>
                      <TableCell>{route.startLocation}</TableCell>
                      <TableCell>{route.endLocation}</TableCell>
                      <TableCell>{route.distance}</TableCell>
                      <TableCell>{route.estimatedTime}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-gray-500 border-gray-500">
                          {route.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewRoute(route)}>
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            Activate
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
      </Tabs>

      {selectedRoute && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Route Details: {selectedRoute.routeId}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSelectedRoute(null)}>
                Close
              </Button>
            </div>
            <CardDescription>Detailed information about this route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Route Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Start Location:</span>
                    <span className="text-sm font-medium">{selectedRoute.startLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">End Location:</span>
                    <span className="text-sm font-medium">{selectedRoute.endLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Distance:</span>
                    <span className="text-sm font-medium">{selectedRoute.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Estimated Time:</span>
                    <span className="text-sm font-medium">{selectedRoute.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status:</span>
                    <span className="text-sm font-medium">{selectedRoute.status}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Road Condition:</span>
                    <span className="text-sm font-medium">Good</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Traffic Level:</span>
                    <span className="text-sm font-medium">Moderate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Fuel Consumption:</span>
                    <span className="text-sm font-medium">~15 liters</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Used:</span>
                    <span className="text-sm font-medium">2023-11-02</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-muted-foreground">Route Map</h3>
              <div className="mt-2 h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Interactive Map</p>
                  <p className="text-xs text-gray-400">
                    Showing route from {selectedRoute.startLocation} to {selectedRoute.endLocation}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

