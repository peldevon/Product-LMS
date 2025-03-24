"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, Eye, XCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getShipments } from "@/app/actions/shipments"
import { shipmentHandlers } from "@/app/utils/actionHandlers"

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

export default function FarmerTransportationPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [shipmentForm, setShipmentForm] = useState({
    from: "",
    to: "",
    quantity: 0,
    dispatchDate: ""
  });
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [showShipmentDetails, setShowShipmentDetails] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    async function fetchShipments() {
      setLoading(true);
      try {
        const fetchedShipments = await getShipments();
        setShipments(fetchedShipments as Shipment[]);
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchShipments();
  }, []);

  const handleSubmitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const requestData = {
        ...shipmentForm,
        transporter: "Pending Assignment",
        status: "Scheduled" as const
      };
      
      const result = await shipmentHandlers.createShipment(requestData);
      
      // Refresh shipments
      const updatedShipments = await getShipments();
      setShipments(updatedShipments as Shipment[]);
      
      setShowRequestForm(false);
      setShipmentForm({
        from: "",
        to: "",
        quantity: 0,
        dispatchDate: ""
      });
      
      toast({
        title: "Transport request submitted",
        description: "Your transport request has been successfully submitted."
      });
    } catch (error) {
      console.error('Failed to submit transport request:', error);
      toast({
        title: "Request failed",
        description: "There was an error submitting your transport request.",
        variant: "destructive"
      });
    }
  };

  const handleViewDetails = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setShowShipmentDetails(true);
  };

  const handleCancelShipment = async () => {
    if (!selectedShipment) return;
    
    try {
      // Only allow cancellation if the shipment is still in 'Scheduled' status
      if (selectedShipment.status !== 'Scheduled') {
        toast({
          title: "Cannot cancel shipment",
          description: "Only scheduled shipments can be cancelled.",
          variant: "destructive"
        });
        return;
      }
      
      await shipmentHandlers.deleteShipment(selectedShipment.id);
      
      // Update the shipments list
      setShipments(prev => prev.filter(s => s.id !== selectedShipment.id));
      
      setShowCancelDialog(false);
      setShowShipmentDetails(false);
      
      toast({
        title: "Shipment cancelled",
        description: "The shipment has been successfully cancelled."
      });
    } catch (error) {
      console.error('Failed to cancel shipment:', error);
      toast({
        title: "Cancellation failed",
        description: "There was an error cancelling the shipment.",
        variant: "destructive"
      });
    }
  };

  // Filter shipments by status
  const activeShipments = shipments.filter(s => s.status !== 'Delivered');
  const completedShipments = shipments.filter(s => s.status === 'Delivered');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
        <h1 className="text-2xl font-bold">Transportation Management</h1>
          <p className="text-muted-foreground">Manage your cassava transportation requests</p>
        </div>
        <Button onClick={() => setShowRequestForm(true)}>
          <Truck className="mr-2 h-4 w-4" />
          Request Transport
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Requests</TabsTrigger>
          <TabsTrigger value="completed">Completed Shipments</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
        <Card>
          <CardHeader>
              <CardTitle>Active Transport Requests</CardTitle>
              <CardDescription>Requests that are scheduled or in transit</CardDescription>
          </CardHeader>
          <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <p>Loading shipments...</p>
                </div>
              ) : activeShipments.length === 0 ? (
                <div className="flex justify-center p-4">
                  <p>No active transport requests found.</p>
                </div>
              ) : (
          <Table>
            <TableHeader>
              <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Dispatch Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                    {activeShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.shipmentId}</TableCell>
                        <TableCell>{shipment.from}</TableCell>
                        <TableCell>{shipment.to}</TableCell>
                        <TableCell>{shipment.quantity}</TableCell>
                        <TableCell>{new Date(shipment.dispatchDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                          <Badge 
                            className={
                              shipment.status === "In Transit" 
                                ? "bg-yellow-500" 
                                : "bg-blue-500"
                            }>
                            {shipment.status}
                          </Badge>
                  </TableCell>
                  <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(shipment)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                            {shipment.status === "Scheduled" && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  setSelectedShipment(shipment);
                                  setShowCancelDialog(true);
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Shipments</CardTitle>
              <CardDescription>Previously completed shipments</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center p-4">
                  <p>Loading shipments...</p>
                </div>
              ) : completedShipments.length === 0 ? (
                <div className="flex justify-center p-4">
                  <p>No completed shipments found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Delivery Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.shipmentId}</TableCell>
                        <TableCell>{shipment.from}</TableCell>
                        <TableCell>{shipment.to}</TableCell>
                        <TableCell>{shipment.quantity}</TableCell>
                        <TableCell>{shipment.deliveryDate ? new Date(shipment.deliveryDate).toLocaleDateString() : "N/A"}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">
                            {shipment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(shipment)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>

      {/* Request Transport Dialog */}
      <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Transport</DialogTitle>
            <DialogDescription>
              Fill out the form below to request transportation for your cassava products.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRequest}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="from" className="text-right">
                  From
                </Label>
                <Input
                  id="from"
                  value={shipmentForm.from}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, from: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="to" className="text-right">
                  To
                </Label>
                <Input
                  id="to"
                  value={shipmentForm.to}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, to: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity (kg)
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={shipmentForm.quantity}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, quantity: Number(e.target.value) })}
                  className="col-span-3"
                  min="1"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dispatchDate" className="text-right">
                  Dispatch Date
                </Label>
                <Input
                  id="dispatchDate"
                  type="date"
                  value={shipmentForm.dispatchDate}
                  onChange={(e) => setShipmentForm({ ...shipmentForm, dispatchDate: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Shipment Details Dialog */}
      {selectedShipment && (
        <Dialog open={showShipmentDetails} onOpenChange={setShowShipmentDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Shipment Details: {selectedShipment.shipmentId}</DialogTitle>
              <DialogDescription>
                Complete shipment information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">From:</Label>
                <div className="col-span-2">{selectedShipment.from}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">To:</Label>
                <div className="col-span-2">{selectedShipment.to}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Quantity:</Label>
                <div className="col-span-2">{selectedShipment.quantity} kg</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Transporter:</Label>
                <div className="col-span-2">{selectedShipment.transporter}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Status:</Label>
                <div className="col-span-2">
                  <Badge 
                    className={
                      selectedShipment.status === "In Transit" 
                        ? "bg-yellow-500" 
                        : selectedShipment.status === "Delivered" 
                          ? "bg-green-500" 
                          : "bg-blue-500"
                    }>
                    {selectedShipment.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Dispatch Date:</Label>
                <div className="col-span-2">{new Date(selectedShipment.dispatchDate).toLocaleDateString()}</div>
              </div>
              {selectedShipment.deliveryDate && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="font-medium">Delivery Date:</Label>
                  <div className="col-span-2">{new Date(selectedShipment.deliveryDate).toLocaleDateString()}</div>
                </div>
              )}
            </div>
            <DialogFooter>
              {selectedShipment.status === "Scheduled" && (
                <Button 
                  variant="destructive" 
                  onClick={() => {
                    setShowShipmentDetails(false);
                    setShowCancelDialog(true);
                  }}
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Cancel Shipment
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Transport Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this transport request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Go Back
            </Button>
            <Button variant="destructive" onClick={handleCancelShipment}>
              Yes, Cancel Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

