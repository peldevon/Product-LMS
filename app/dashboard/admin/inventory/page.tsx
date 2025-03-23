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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

// Import server actions
import { getInventory, getProducts, getWarehouses, createInventoryEntry, updateInventoryQuantity, deleteInventoryEntry } from "@/app/actions/inventory"
import { inventoryHandlers } from "@/app/utils/actionHandlers"

// Define types for inventory data
type InventoryItem = {
  inventory: {
    id: number;
    productId: number;
    warehouseId: number;
    quantity: number;
    date: string;
  };
  product: {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    stock: number;
  };
  warehouse: {
    id: number;
    name: string;
    location: string;
    capacity: number;
    used: number;
  };
}

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
}

type Warehouse = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  used: number;
}

// Sample chart data (we'll need to create a separate API call for this aggregated data)
const inventoryByCategory = [
  { name: "Flour", value: 35 },
  { name: "Starch", value: 25 },
  { name: "Chips", value: 20 },
  { name: "Raw", value: 20 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

// Calculate inventory by category from actual data
const calculateInventoryByCategory = (items: InventoryItem[]) => {
  const categoryMap: Record<string, number> = {}
  
  items.forEach(item => {
    const category = item.product.category
    const quantity = item.inventory.quantity
    
    if (categoryMap[category]) {
      categoryMap[category] += quantity
    } else {
      categoryMap[category] = quantity
    }
  })
  
  return Object.entries(categoryMap).map(([name, value]) => ({ name, value }))
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [warehouseFilter, setWarehouseFilter] = useState("All")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [showAddForm, setShowAddForm] = useState(false)
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  
  // Form state for adding new inventory
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    quantity: '',
  })

  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)
  const [updateForm, setUpdateForm] = useState({
    quantity: 0
  })

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch inventory items
        const items = await getInventory()
        setInventoryItems(items as InventoryItem[])
        
        // Fetch products and warehouses for dropdowns
        const productsList = await getProducts()
        setProducts(productsList as Product[])
        
        const warehousesList = await getWarehouses()
        setWarehouses(warehousesList as Warehouse[])
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // Filter inventory items based on search term and filters
  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesWarehouse = warehouseFilter === "All" || item.warehouse.name === warehouseFilter
    const matchesCategory = categoryFilter === "All" || item.product.category === categoryFilter
    
    return matchesSearch && matchesWarehouse && matchesCategory
  })

  // Calculate total inventory quantity and value
  const totalQuantity = inventoryItems.reduce((sum, item) => sum + item.inventory.quantity, 0)
  const totalValue = inventoryItems.reduce((sum, item) => sum + (item.inventory.quantity * item.product.price), 0)
  
  // Calculate warehouse utilization
  const warehouseUtilization = warehouses.map(warehouse => ({
    name: warehouse.name,
    used: warehouse.used,
    available: warehouse.capacity - warehouse.used
  }))
  
  // Calculate inventory by category data
  const inventoryCategoryData = calculateInventoryByCategory(inventoryItems)
  
  // Handle adding new inventory
  const handleAddInventory = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const data = {
        productId: parseInt(formData.productId),
        warehouseId: parseInt(formData.warehouseId),
        quantity: parseInt(formData.quantity),
        date: new Date().toISOString().split('T')[0]
      }
      
      await createInventoryEntry(data)
      
      // Reset form
      setFormData({
        productId: '',
        warehouseId: '',
        quantity: '',
      })
      
      // Refresh inventory data
      const updatedItems = await getInventory()
      setInventoryItems(updatedItems as InventoryItem[])
      
      setShowAddForm(false)
    } catch (error) {
      console.error('Failed to add inventory:', error)
    }
  }
  
  // Handle inventory update
  const handleUpdate = (item: InventoryItem) => {
    setCurrentItem(item)
    setUpdateForm({
      quantity: item.inventory.quantity
    })
    setShowUpdateDialog(true)
  }
  
  const handleUpdateSubmit = async () => {
    if (!currentItem) return
    
    try {
      await updateInventoryQuantity(currentItem.inventory.id, updateForm.quantity)
      
      // Update local state
      setInventoryItems(prev => prev.map(i => 
        i.inventory.id === currentItem.inventory.id 
          ? {...i, inventory: {...i.inventory, quantity: updateForm.quantity}} 
          : i
      ))
      
      // Recalculate statistics
      const updatedData = [...inventoryItems.map(i => 
        i.inventory.id === currentItem.inventory.id 
          ? {...i, inventory: {...i.inventory, quantity: updateForm.quantity}} 
          : i
      )]
      calculateInventoryStats(updatedData)
      
      setShowUpdateDialog(false)
      toast({
        title: "Inventory updated",
        description: "Inventory quantity has been updated successfully"
      })
    } catch (error) {
      console.error('Failed to update inventory:', error)
      toast({
        title: "Update failed",
        description: "There was an error updating the inventory",
        variant: "destructive"
      })
    }
  }
  
  // Handle inventory deletion
  const handleDelete = (item: InventoryItem) => {
    setCurrentItem(item)
    setShowDeleteDialog(true)
  }
  
  const handleDeleteSubmit = async () => {
    if (!currentItem) return
    
    try {
      await deleteInventoryEntry(currentItem.inventory.id)
      
      // Update local state
      const updatedData = inventoryItems.filter(i => i.inventory.id !== currentItem.inventory.id)
      setInventoryItems(updatedData)
      
      // Recalculate statistics
      calculateInventoryStats(updatedData)
      
      setShowDeleteDialog(false)
      toast({
        title: "Inventory deleted",
        description: "Inventory item has been deleted successfully"
      })
    } catch (error) {
      console.error('Failed to delete inventory:', error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the inventory item",
        variant: "destructive"
      })
    }
  }
  
  // Update the calculateInventoryStats function to include as a separate function
  const calculateInventoryStats = (data: InventoryItem[]) => {
    const totalQuantity = data.reduce((sum, item) => sum + item.inventory.quantity, 0)
    const totalValue = data.reduce((sum, item) => sum + (item.inventory.quantity * item.product.price), 0)
    
    // Calculate warehouse utilization
    const warehouseUsage = data.reduce((acc, item) => {
      const warehouseId = item.inventory.warehouseId
      acc[warehouseId] = (acc[warehouseId] || 0) + item.inventory.quantity
      return acc
    }, {} as Record<number, number>)
    
    setTotalQuantity(totalQuantity)
    setTotalValue(totalValue)
    setWarehouseUtilization(warehouseUsage)
    
    // Also calculate category distribution for the pie chart
    const categoryData = data.reduce((acc, item) => {
      const category = item.product.category
      acc[category] = (acc[category] || 0) + item.inventory.quantity
      return acc
    }, {} as Record<string, number>)
    
    const pieData = Object.entries(categoryData).map(([name, value]) => ({ name, value }))
    setCategoryData(pieData)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
      <h1 className="text-2xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage and track inventory across warehouses
          </p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Inventory"}
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Inventory</CardTitle>
            <CardDescription>Add new inventory to a warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddInventory} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product">Product</Label>
                  <Select 
                    value={formData.productId} 
                    onValueChange={(value) => setFormData({...formData, productId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map(product => (
                        <SelectItem key={product.id} value={product.id.toString()}>
                          {product.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="warehouse">Warehouse</Label>
                  <Select 
                    value={formData.warehouseId} 
                    onValueChange={(value) => setFormData({...formData, warehouseId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map(warehouse => (
                        <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    placeholder="Enter quantity" 
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    min="0"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">Add Inventory</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warehouses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{warehouses.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Distribution of inventory by product category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={inventoryCategoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {inventoryCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Warehouse Utilization</CardTitle>
            <CardDescription>Space used vs available in each warehouse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={warehouseUtilization}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="used" stackId="a" fill="#8884d8" name="Used Space" />
                  <Bar dataKey="available" stackId="a" fill="#82ca9d" name="Available Space" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory List</CardTitle>
          <CardDescription>All inventory items across warehouses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                  placeholder="Search by product or warehouse name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
              />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Warehouses</SelectItem>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse.id} value={warehouse.name}>
                      {warehouse.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {/* Get unique categories from products */}
                  {Array.from(new Set(products.map(p => p.category))).map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
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
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Date Added</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Loading inventory...
                    </TableCell>
                  </TableRow>
                ) : filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No inventory items found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.inventory.id}>
                      <TableCell>{item.product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.product.category}</Badge>
                      </TableCell>
                      <TableCell>{item.warehouse.name}</TableCell>
                      <TableCell>{item.inventory.quantity}</TableCell>
                      <TableCell>${(item.inventory.quantity * item.product.price).toFixed(2)}</TableCell>
                      <TableCell>{item.inventory.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleUpdate(item)}>
                            Update
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(item)}>
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

      {/* Update Dialog */}
      {currentItem && (
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Inventory</DialogTitle>
              <DialogDescription>
                Update the quantity for {currentItem.product.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={updateForm.quantity}
                  onChange={(e) => setUpdateForm({...updateForm, quantity: Number(e.target.value)})}
                  className="col-span-3"
                  min={0}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSubmit}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Dialog */}
      {currentItem && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {currentItem.product.name} from inventory? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteSubmit}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

