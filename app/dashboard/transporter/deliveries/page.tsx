"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Eye, Truck, CheckCircle } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"

// Import server actions
import { getShipments } from "@/app/actions/shipments"
import { shipmentHandlers } from "@/app/utils/actionHandlers"

// Define types
type Shipment = {
  id: number;
  shipmentId: string;
  from: string;
  to: string;
  quantity: number;
  transporter: string;
  dispatchDate: string;
  deliveryDate: string | null;
  status: 'Scheduled' | 'In Transit' | 'Delivered';
};

export default function TransporterDeliveriesPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDelivery, setSelectedDelivery] = useState<Shipment | null>(null)
  const [showDeliveryDetails, setShowDeliveryDetails] = useState(false)

  useEffect(() => {
    async function fetchShipments() {
      setLoading(true)
      try {
        const fetchedShipments = await getShipments()
        setShipments(fetchedShipments as Shipment[])
      } catch (error) {
        console.error('Failed to fetch shipments:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchShipments()
  }, [])

  // Filter deliveries by status
  const activeDeliveries = shipments.filter((d) => ["In Transit", "Scheduled"].includes(d.status))
  const completedDeliveries = shipments.filter((d) => d.status === "Delivered")

  const handleViewDetails = async (shipment: Shipment) => {
    try {
      const shipmentDetails = await shipmentHandlers.viewShipment(shipment.id)
      if (shipmentDetails) {
        setSelectedDelivery(shipmentDetails as Shipment)
        setShowDeliveryDetails(true)
      }
    } catch (error) {
      console.error('Failed to fetch shipment details:', error)
    }
  }

  const handleUpdateStatus = async (shipmentId: number, newStatus: string) => {
    try {
      await shipmentHandlers.updateShipmentStatus(shipmentId, newStatus)
      
      // Refresh deliveries
      const updatedShipments = await getShipments()
      setShipments(updatedShipments as Shipment[])
      
      alert(`Delivery status updated to ${newStatus}`)
    } catch (error) {
      console.error('Failed to update delivery status:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Deliveries Management</h1>
      <p className="text-muted-foreground">Manage and track all your cassava deliveries</p>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Deliveries</TabsTrigger>
          <TabsTrigger value="completed">Completed Deliveries</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Active Deliveries</h2>
              <p className="text-sm text-muted-foreground">Manage your in-progress deliveries</p>
            </div>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Dispatch Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Spinner className="h-6 w-6 mr-2" />
                        <span>Loading deliveries...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : activeDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No active deliveries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>{delivery.shipmentId}</TableCell>
                      <TableCell>{delivery.from}</TableCell>
                      <TableCell>{delivery.to}</TableCell>
                      <TableCell>{delivery.quantity} kg</TableCell>
                      <TableCell>{new Date(delivery.dispatchDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            delivery.status === "In Transit"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }
                        >
                          {delivery.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(delivery)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          {delivery.status === "Scheduled" ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUpdateStatus(delivery.id, "In Transit")}
                            >
                              <Truck className="h-4 w-4 mr-1" />
                              Start Transit
                            </Button>
                          ) : delivery.status === "In Transit" ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleUpdateStatus(delivery.id, "Delivered")}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Delivered
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="completed" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Completed Deliveries</h2>
              <p className="text-sm text-muted-foreground">View history of completed deliveries</p>
            </div>
          </div>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Shipment ID</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center">
                        <Spinner className="h-6 w-6 mr-2" />
                        <span>Loading deliveries...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : completedDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No completed deliveries found.
                    </TableCell>
                  </TableRow>
                ) : (
                  completedDeliveries.map((delivery) => (
                    <TableRow key={delivery.id}>
                      <TableCell>{delivery.shipmentId}</TableCell>
                      <TableCell>{delivery.from}</TableCell>
                      <TableCell>{delivery.to}</TableCell>
                      <TableCell>{delivery.quantity} kg</TableCell>
                      <TableCell>{new Date(delivery.deliveryDate || "").toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-500">{delivery.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewDetails(delivery)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delivery Details Dialog */}
      {selectedDelivery && (
        <Dialog open={showDeliveryDetails} onOpenChange={setShowDeliveryDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Delivery Details: {selectedDelivery.shipmentId}</DialogTitle>
              <DialogDescription>Complete delivery information</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Pickup Location</p>
                <p className="font-medium">{selectedDelivery.from}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium">{selectedDelivery.to}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{selectedDelivery.quantity} kg</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  className={
                    selectedDelivery.status === "In Transit"
                      ? "bg-yellow-500"
                      : selectedDelivery.status === "Delivered"
                        ? "bg-green-500" 
                        : "bg-blue-500"
                  }
                >
                  {selectedDelivery.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Dispatch Date</p>
                <p className="font-medium">{new Date(selectedDelivery.dispatchDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivery Date</p>
                <p className="font-medium">
                  {selectedDelivery.deliveryDate 
                    ? new Date(selectedDelivery.deliveryDate).toLocaleDateString() 
                    : "Not delivered yet"}
                </p>
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Delivery Map</h3>
              <Card className="h-52 bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Interactive delivery map will be displayed here</p>
              </Card>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              {selectedDelivery.status === "Scheduled" && (
                <Button onClick={() => handleUpdateStatus(selectedDelivery.id, "In Transit")}>
                  <Truck className="h-4 w-4 mr-2" />
                  Start Transit
                </Button>
              )}
              {selectedDelivery.status === "In Transit" && (
                <Button onClick={() => handleUpdateStatus(selectedDelivery.id, "Delivered")}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

