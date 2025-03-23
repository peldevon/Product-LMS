"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Import server actions and handlers
import { getOrders, updateOrder } from "@/app/actions/order"
import { orderHandlers } from "@/app/utils/actionHandlers"

// Define types for order data to match the database schema
type Order = {
  id: number;
  orderId: string;
  customer: string;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string | null;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
};

// Type for the combined order with items
type OrderWithItems = Order & {
  orderItems: Array<{
    item: {
      id: number;
      orderId: number;
      productId: number;
      quantity: number;
      unitPrice: number;
    };
    product: {
      id: number;
      name: string;
      description: string;
      category: string;
      price: number;
      stock: number;
    };
  }>;
};

export default function ProcessorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true)
      try {
        const fetchedOrders = await getOrders()
        setOrders(fetchedOrders as Order[])
      } catch (error) {
        console.error('Failed to fetch orders:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrders()
  }, [])

  // Calculate filtered orders
  const activeOrders = orders.filter((order) => ["Processing", "Shipped"].includes(order.status))
  const completedOrders = orders.filter((order) => order.status === "Delivered")
  const pendingOrders = orders.filter((order) => order.status === "Pending")

  // Handle view order details
  const handleViewOrder = async (orderId: number) => {
    try {
      const orderWithItems = await orderHandlers.viewOrder(orderId)
      setSelectedOrder(orderWithItems as OrderWithItems)
      setShowOrderDetails(true)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    }
  }

  // Handle updating order status
  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await orderHandlers.updateOrderStatus(orderId, newStatus)
      
      // Refresh orders
      const updatedOrders = await getOrders()
      setOrders(updatedOrders as Order[])
      
      alert(`Order status updated to ${newStatus}`)
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders Management</h1>
      <p className="text-muted-foreground">Manage and track customer orders for processed cassava products</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <CardDescription>All orders in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <CardDescription>Orders currently being processed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CardDescription>Orders that have been delivered</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <CardDescription>Orders awaiting processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Orders</TabsTrigger>
          <TabsTrigger value="completed">Completed Orders</TabsTrigger>
          <TabsTrigger value="all">All Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      {/* Product info will be visible in details */}
                      Multiple products
                    </TableCell>
                    <TableCell>
                      {/* Quantity will be visible in details */}
                      Various
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Pending'}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewOrder(order.id)}>
                        View
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order.id, "Shipped")}>
                        Update to Shipped
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {completedOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.orderId}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>
                      {/* Product info will be visible in details */}
                      Multiple products
                    </TableCell>
                    <TableCell>
                      {/* Quantity will be visible in details */}
                      Various
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Pending'}</TableCell>
                    <TableCell>
                      <Badge variant="default">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewOrder(order.id)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="all">
          <div className="relative overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Products</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Delivery Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.orderId}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>Multiple products</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Pending'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            order.status === "Delivered" 
                              ? "default" 
                              : order.status === "Processing" 
                                ? "secondary" 
                                : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleViewOrder(order.id)}>
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

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Order Details: {selectedOrder.orderId}</DialogTitle>
              <DialogDescription>Complete order information</DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Customer</p>
                <p className="font-medium">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Order Date</p>
                <p className="font-medium">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge
                  variant={
                    selectedOrder.status === "Delivered" 
                      ? "default" 
                      : selectedOrder.status === "Processing" 
                        ? "secondary" 
                        : "outline"
                  }
                >
                  {selectedOrder.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-medium">${selectedOrder.totalAmount.toFixed(2)}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.orderItems.map((item) => (
                    <TableRow key={item.item.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>{item.item.quantity}</TableCell>
                      <TableCell>${item.item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>${(item.item.quantity * item.item.unitPrice).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            <div className="mt-4 border-t pt-4">
              <h3 className="font-semibold mb-2">Order Actions</h3>
              {selectedOrder.status !== "Delivered" && (
                <div className="flex flex-wrap gap-2">
                  {selectedOrder.status === "Processing" && (
                    <Button onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "Shipped");
                      setShowOrderDetails(false);
                    }}>
                      Mark as Shipped
                    </Button>
                  )}
                  {selectedOrder.status === "Shipped" && (
                    <Button onClick={() => {
                      handleUpdateStatus(selectedOrder.id, "Delivered");
                      setShowOrderDetails(false);
                    }}>
                      Mark as Delivered
                    </Button>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

