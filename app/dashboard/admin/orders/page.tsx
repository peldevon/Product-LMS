"use client"

import { useState, useEffect } from "react"
import {
  MagnifyingGlassIcon,
  DownloadIcon,
} from "@radix-ui/react-icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// Import server actions
import { getOrders, getOrderItems, createOrder, updateOrder, deleteOrder, createOrderItem, deleteOrderItem, getOrderById } from "@/app/actions/order"
import { getProducts } from "@/app/actions/inventory"
import { orderHandlers } from "@/app/utils/actionHandlers"

// Define types for order data
type Order = {
  id: number;
  orderId: string;
  customer: string;
  totalAmount: number;
  orderDate: string;
  deliveryDate: string | null;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
};

type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
};

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
};

// Type for the combined order with items
type OrderWithItems = Order & {
  orderItems: Array<{
    item: OrderItem;
    product: Product;
  }>;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [dateFilter, setDateFilter] = useState("All")
  const [orderDetails, setOrderDetails] = useState<OrderWithItems | null>(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Form state for new order
  const [formItems, setFormItems] = useState<{productId: string, quantity: string}[]>([
    { productId: '', quantity: '' }
  ])
  const [formData, setFormData] = useState({
    customerName: '',
    notes: ''
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const fetchedOrders = await getOrders()
        setOrders(fetchedOrders as Order[])
        
        const productsList = await getProducts()
        setProducts(productsList as Product[])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Calculate order statistics
  const totalOrders = orders.length
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const processingOrders = orders.filter(order => order.status === 'Processing').length
  const shippedOrders = orders.filter(order => order.status === 'Shipped').length
  const deliveredOrders = orders.filter(order => order.status === 'Delivered').length
  const pendingOrders = orders.filter(order => order.status === 'Pending').length

  // Prepare data for the order trends chart
  const currentDate = new Date()
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(currentDate)
    date.setMonth(currentDate.getMonth() - i)
    return date.toLocaleDateString('en-US', { month: 'short' })
  }).reverse()

  const orderTrends = last6Months.map(month => {
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate)
      return orderDate.toLocaleDateString('en-US', { month: 'short' }) === month
    })
    
    return {
      month,
      orders: monthOrders.length,
      revenue: monthOrders.reduce((sum, order) => sum + order.totalAmount, 0),
    }
  })

  // Filter orders based on search term and filters
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "All" || order.status === statusFilter
    
    let matchesDate = true
    if (dateFilter === "Last 7 days") {
      const orderDate = new Date(order.orderDate)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      matchesDate = orderDate >= sevenDaysAgo
    } else if (dateFilter === "Last 30 days") {
      const orderDate = new Date(order.orderDate)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      matchesDate = orderDate >= thirtyDaysAgo
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  // Handle view order details
  const handleViewOrder = async (orderId: number) => {
    try {
      const orderWithItems = await orderHandlers.viewOrder(orderId);
      setOrderDetails(orderWithItems as OrderWithItems);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error)
    }
  }
  
  // Handle adding an item to the order form
  const handleAddItemToForm = () => {
    setFormItems([...formItems, { productId: '', quantity: '' }])
  }
  
  // Handle removing an item from the order form
  const handleRemoveItemFromForm = (index: number) => {
    const newItems = [...formItems]
    newItems.splice(index, 1)
    setFormItems(newItems)
  }
  
  // Handle form item change
  const handleFormItemChange = (index: number, field: 'productId' | 'quantity', value: string) => {
    const newItems = [...formItems]
    newItems[index][field] = value
    setFormItems(newItems)
  }
  
  // Handle creating a new order
  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validate form
      if (!formData.customerName.trim()) {
        alert('Please enter a customer name')
        return
      }
      
      if (formItems.some(item => !item.productId || !item.quantity)) {
        alert('Please complete all product items')
        return
      }
      
      // Create order items
      const items = formItems.map(item => {
        const product = products.find(p => p.id.toString() === item.productId)
        return {
          productId: parseInt(item.productId),
          quantity: parseInt(item.quantity),
          unitPrice: product?.price || 0
        }
      })
      
      // Calculate total
      const total = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0)
      
      // Create order object with required fields matching the schema
      const newOrder = {
        orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
        customer: formData.customerName,
        totalAmount: total,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Processing' as const,
      }
      
      // First create the order
      const orderResult = await createOrder(newOrder)
      
      // Then create order items if we have the order ID
      if (orderResult && orderResult.lastInsertRowid) {
        const orderId = Number(orderResult.lastInsertRowid)
        
        // Create each order item
        for (const item of items) {
          await createOrderItem({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice
          })
        }
      }
      
      // Reset form
      setFormData({ customerName: '', notes: '' })
      setFormItems([{ productId: '', quantity: '' }])
      
      // Refresh orders
      const updatedOrders = await getOrders()
      setOrders(updatedOrders as Order[])
      
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to create order:', error)
    }
  }
  
  // Handle deleting an order
  const handleDeleteOrder = async (orderId: number) => {
    try {
      await orderHandlers.deleteOrder(orderId);
      
      // Refresh orders
      const updatedOrders = await getOrders();
      setOrders(updatedOrders as Order[]);
    } catch (error) {
      console.error('Failed to delete order:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
      <h1 className="text-2xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground">
            Track, manage, and process customer orders
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Order"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
            <CardDescription>Enter order details and add products</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateOrder} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input 
                    id="customerName" 
                    value={formData.customerName}
                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>Order Items</Label>
                    <Button type="button" variant="outline" onClick={handleAddItemToForm} size="sm">
                      Add Item
                    </Button>
                  </div>
                  
                  {formItems.map((item, index) => (
                    <div key={index} className="flex gap-3 items-end mb-2">
                      <div className="flex-1">
                        <Label htmlFor={`product-${index}`}>Product</Label>
                        <Select 
                          value={item.productId} 
                          onValueChange={(value) => handleFormItemChange(index, 'productId', value)}
                        >
                          <SelectTrigger id={`product-${index}`}>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name} - ${product.price.toFixed(2)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-24">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input 
                          id={`quantity-${index}`} 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleFormItemChange(index, 'quantity', e.target.value)}
                          min="1"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItemFromForm(index)}
                        disabled={formItems.length === 1}
                        className="mb-0.5"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                
                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea 
                    id="notes" 
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="Enter any additional notes"
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full">Create Order</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processingOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveredOrders}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Trends</CardTitle>
            <CardDescription>Monthly order volume and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" fill="#8884d8" name="Orders" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>Current distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm font-medium">Processing</div>
                  <div className="text-2xl font-bold">{processingOrders}</div>
                  <div className="text-xs text-muted-foreground">
                    {totalOrders > 0 ? ((processingOrders / totalOrders) * 100).toFixed(0) : 0}% of total
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm font-medium">Shipped</div>
                  <div className="text-2xl font-bold">{shippedOrders}</div>
                  <div className="text-xs text-muted-foreground">
                    {totalOrders > 0 ? ((shippedOrders / totalOrders) * 100).toFixed(0) : 0}% of total
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm font-medium">Delivered</div>
                  <div className="text-2xl font-bold">{deliveredOrders}</div>
                  <div className="text-xs text-muted-foreground">
                    {totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(0) : 0}% of total
                  </div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-sm font-medium">Pending</div>
                  <div className="text-2xl font-bold">{pendingOrders}</div>
                  <div className="text-xs text-muted-foreground">
                    {totalOrders > 0 ? ((pendingOrders / totalOrders) * 100).toFixed(0) : 0}% of total
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage and track all customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                  placeholder="Search by order ID or customer name..."
                  className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
              </div>
          </div>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="All">All Time</SelectItem>
                  <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                  <SelectItem value="Last 30 days">Last 30 days</SelectItem>
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
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                    <TableHead>Items</TableHead>
                  <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading orders...
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.orderId}</TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.status === "Delivered"
                              ? "default"
                              : order.status === "Processing"
                              ? "secondary"
                              : order.status === "Shipped"
                              ? "outline"
                              : "destructive"
                          }
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewOrder(order.id)}
                          >
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => handleDeleteOrder(order.id)}
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

      {/* Order Details Modal */}
      {showOrderDetails && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Order {orderDetails.orderId}</h2>
                <Button variant="outline" onClick={() => setShowOrderDetails(false)}>Close</Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{orderDetails.customer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-medium">{new Date(orderDetails.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      orderDetails.status === "Delivered"
                        ? "default"
                        : orderDetails.status === "Processing"
                        ? "secondary"
                        : orderDetails.status === "Shipped"
                        ? "outline"
                        : "destructive"
                    }
                  >
                    {orderDetails.status.charAt(0).toUpperCase() + orderDetails.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="font-medium">${orderDetails.totalAmount.toFixed(2)}</p>
                          </div>
                        </div>
              
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Subtotal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                    {orderDetails.orderItems.map((item) => (
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
              
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2 border-t">
                    <span>Subtotal:</span>
                    <span>${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t">
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-t font-bold">
                    <span>Total:</span>
                    <span>${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
                          </div>
      )}
    </div>
  )
}

