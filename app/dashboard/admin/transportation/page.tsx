"use client"

import { useState, useEffect } from "react"
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
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Import server actions
import { getShipments, updateShipmentStatus, deleteShipment } from "@/app/actions/shipments"
import { getTransportData } from "@/app/actions/analytics"

// Shipment type definition
type Shipment = {
  id: number;
  shipmentId: string;
  from: string;
  to: string;
  quantity: number;
  transporter: string;
  dispatchDate: string;
  deliveryDate: string;
  status: 'Scheduled' | 'In Transit' | 'Delivered';
}

// Sample performance data for initial render
// This would ideally come from analytics data in the database
const performanceData = [
  { month: "Jun", "On-Time Delivery": 92, Delayed: 8 },
  { month: "Jul", "On-Time Delivery": 95, Delayed: 5 },
  { month: "Aug", "On-Time Delivery": 90, Delayed: 10 },
  { month: "Sep", "On-Time Delivery": 88, Delayed: 12 },
  { month: "Oct", "On-Time Delivery": 94, Delayed: 6 },
  { month: "Nov", "On-Time Delivery": 96, Delayed: 4 },
]

// Sample volume data for initial render
const volumeData = [
  { month: "Jun", "Volume (kg)": 15000 },
  { month: "Jul", "Volume (kg)": 17500 },
  { month: "Aug", "Volume (kg)": 16000 },
  { month: "Sep", "Volume (kg)": 18500 },
  { month: "Oct", "Volume (kg)": 21000 },
  { month: "Nov", "Volume (kg)": 22500 },
]

export default function AdminTransportationPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [transporterFilter, setTransporterFilter] = useState("All")
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [transportStats, setTransportStats] = useState({
    inTransit: 0,
    scheduled: 0,
    delivered: 0
  })

  // Fetch shipments from database
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch shipments
        const data = await getShipments(searchTerm, statusFilter, transporterFilter)
        setShipments(data as Shipment[])
        
        // Fetch transportation stats
        const stats = await getTransportData()
        if (stats.length > 0) {
          setTransportStats({
            inTransit: Number(stats[0].inTransit) || 0,
            scheduled: Number(stats[0].scheduled) || 0,
            delivered: Number(stats[0].delivered) || 0
          })
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [searchTerm, statusFilter, transporterFilter])

  // Filter shipments based on current filters
  const filteredShipments = shipments

  // Calculate summary counts from actual data
  const inTransitCount = shipments.filter(s => s.status === "In Transit").length
  const scheduledCount = shipments.filter(s => s.status === "Scheduled").length
  const deliveredCount = shipments.filter(s => s.status === "Delivered").length
  
  // Handle status update
  const handleStatusUpdate = async (id: number, newStatus: 'Scheduled' | 'In Transit' | 'Delivered') => {
    try {
      await updateShipmentStatus(id, newStatus)
      // Refresh data
      const updatedShipments = await getShipments(searchTerm, statusFilter, transporterFilter)
      setShipments(updatedShipments as Shipment[])
    } catch (error) {
      console.error('Failed to update shipment status:', error)
    }
  }
  
  // Handle deletion
  const handleDeleteShipment = async (id: number) => {
    if (confirm('Are you sure you want to delete this shipment?')) {
      try {
        await deleteShipment(id)
        // Refresh data
        const updatedShipments = await getShipments(searchTerm, statusFilter, transporterFilter)
        setShipments(updatedShipments as Shipment[])
      } catch (error) {
        console.error('Failed to delete shipment:', error)
      }
    }
  }

  // Active and completed shipments
  const activeShipments = shipments.filter((s) => s.status === "In Transit" || s.status === "Scheduled")
  const completedShipments = shipments.filter((s) => s.status === "Delivered")

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transportation Management</h1>
      <p className="text-muted-foreground">Monitor and manage transportation operations across the supply chain</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{shipments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inTransitCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Delivery Performance</CardTitle>
            <CardDescription>On-time delivery performance over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceData}
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
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="On-Time Delivery" fill="#10b981" />
                  <Bar dataKey="Delayed" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transportation Volume</CardTitle>
            <CardDescription>Monthly transportation volume</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={volumeData}
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
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Volume (kg)" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transportation Map</CardTitle>
          <CardDescription>Current shipments and routes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-gray-100 rounded-md flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-500">Interactive Transportation Map</p>
              <p className="text-sm text-gray-400">Showing active shipments and transportation routes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto">
          <TabsTrigger value="all">All Shipments</TabsTrigger>
          <TabsTrigger value="active">Active Shipments</TabsTrigger>
          <TabsTrigger value="completed">Completed Shipments</TabsTrigger>
        </TabsList>

        <div className="flex flex-col md:flex-row gap-4 my-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by ID or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Transit">In Transit</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <DownloadIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Shipments</CardTitle>
              <CardDescription>View and manage all shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by ID or location..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Scheduled">Scheduled</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Transporter</TableHead>
                      <TableHead>Dispatch Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          Loading shipments...
                        </TableCell>
                      </TableRow>
                    ) : filteredShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No shipments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell>{shipment.shipmentId}</TableCell>
                          <TableCell>{shipment.from}</TableCell>
                          <TableCell>{shipment.to}</TableCell>
                          <TableCell>{shipment.quantity}</TableCell>
                          <TableCell>{shipment.transporter}</TableCell>
                          <TableCell>{shipment.dispatchDate}</TableCell>
                          <TableCell>{shipment.deliveryDate}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                shipment.status === "Delivered"
                                  ? "bg-green-100 text-green-800"
                                  : shipment.status === "In Transit"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {shipment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {shipment.status !== "Delivered" && (
                                <Select 
                                  onValueChange={(value) => 
                                    handleStatusUpdate(
                                      shipment.id, 
                                      value as 'Scheduled' | 'In Transit' | 'Delivered'
                                    )
                                  }
                                  defaultValue={shipment.status}
                                >
                                  <SelectTrigger className="h-8 w-[130px]">
                                    <SelectValue placeholder="Update Status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                                    <SelectItem value="In Transit">In Transit</SelectItem>
                                    <SelectItem value="Delivered">Delivered</SelectItem>
                                  </SelectContent>
                                </Select>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteShipment(shipment.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Transporter</TableHead>
                      <TableHead>Dispatch Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          Loading shipments...
                        </TableCell>
                      </TableRow>
                    ) : activeShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                          No active shipments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      activeShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell>{shipment.shipmentId}</TableCell>
                          <TableCell>{shipment.from}</TableCell>
                          <TableCell>{shipment.to}</TableCell>
                          <TableCell>{shipment.quantity}</TableCell>
                          <TableCell>{shipment.transporter}</TableCell>
                          <TableCell>{shipment.dispatchDate}</TableCell>
                          <TableCell>{shipment.deliveryDate}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                shipment.status === "In Transit"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {shipment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Select 
                                onValueChange={(value) => 
                                  handleStatusUpdate(
                                    shipment.id, 
                                    value as 'Scheduled' | 'In Transit' | 'Delivered'
                                  )
                                }
                                defaultValue={shipment.status}
                              >
                                <SelectTrigger className="h-8 w-[130px]">
                                  <SelectValue placeholder="Update Status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                                  <SelectItem value="In Transit">In Transit</SelectItem>
                                  <SelectItem value="Delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Transporter</TableHead>
                      <TableHead>Dispatch Date</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Loading shipments...
                        </TableCell>
                      </TableRow>
                    ) : completedShipments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          No completed shipments found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      completedShipments.map((shipment) => (
                        <TableRow key={shipment.id}>
                          <TableCell>{shipment.shipmentId}</TableCell>
                          <TableCell>{shipment.from}</TableCell>
                          <TableCell>{shipment.to}</TableCell>
                          <TableCell>{shipment.quantity}</TableCell>
                          <TableCell>{shipment.transporter}</TableCell>
                          <TableCell>{shipment.dispatchDate}</TableCell>
                          <TableCell>{shipment.deliveryDate}</TableCell>
                          <TableCell>
                            <Badge className="bg-green-100 text-green-800">
                              {shipment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

