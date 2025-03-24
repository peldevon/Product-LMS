"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { qualityData } from "@/lib/chart-data"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { getInventory, updateInventoryQuantity, deleteInventoryEntry } from "@/app/actions/inventory"

// Colors for the pie chart
const COLORS = ["#00C49F", "#FFBB28", "#FF8042"]

// Define the type for inventory items
type InventoryItem = {
  id: number;
  productId: number;
  warehouseId: number;
  quantity: number;
  date: string;
  product: {
    name: string;
    price: number;
    category: string;
  };
  warehouse: {
    name: string;
    location: string;
  };
};

export default function FarmerInventoryPage() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    batch: "",
    quantity: "",
    quality: "",
    harvestDate: "",
  })
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null)
  const [editForm, setEditForm] = useState({
    quantity: 0
  })

  // Fetch inventory data
  useEffect(() => {
    const fetchInventory = async () => {
      setIsLoading(true);
      try {
        const data = await getInventory();
        setInventory(data.map(item => ({
          id: item.inventory.id,
          productId: item.inventory.productId,
          warehouseId: item.inventory.warehouseId,
          quantity: item.inventory.quantity,
          date: item.inventory.date,
          product: {
            name: item.product.name,
            price: item.product.price,
            category: item.product.category,
          },
          warehouse: {
            name: item.warehouse.name,
            location: item.warehouse.location,
          }
        })));
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
        toast({
          title: "Error",
          description: "Failed to load inventory data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send data to an API
    setShowAddForm(false)
    // Reset form
    setNewItem({
      batch: "",
      quantity: "",
      quality: "",
      harvestDate: "",
    })
    // Show success message or update inventory
    toast({
      title: "Success",
      description: "Inventory item added successfully!",
    });
  }

  const handleEditClick = (item: InventoryItem) => {
    setCurrentItem(item)
    setEditForm({
      quantity: item.quantity
    })
    setShowEditDialog(true)
  }
  
  const handleDeleteClick = (item: InventoryItem) => {
    setCurrentItem(item)
    setShowDeleteDialog(true)
  }
  
  const handleEditSubmit = async () => {
    if (!currentItem) return;
    
    try {
      await updateInventoryQuantity(currentItem.id, editForm.quantity);
      
      // Update local state with only quantity change
      setInventory(prev => 
        prev.map(item => 
          item.id === currentItem.id 
            ? {
                ...item,
                quantity: editForm.quantity
              } 
            : item
        )
      );
      
      setShowEditDialog(false);
      toast({
        title: "Inventory updated",
        description: "Your inventory item has been successfully updated.",
      });
    } catch (error) {
      console.error("Failed to update inventory:", error);
      toast({
        title: "Update failed",
        description: "There was an error updating your inventory.",
        variant: "destructive",
      });
    }
  };
  
  const handleDeleteSubmit = async () => {
    if (!currentItem) return;
    
    try {
      await deleteInventoryEntry(currentItem.id);
      
      // Update local state
      setInventory(prev => prev.filter(item => item.id !== currentItem.id));
      
      setShowDeleteDialog(false);
      toast({
        title: "Inventory deleted",
        description: "Your inventory item has been successfully deleted.",
      });
    } catch (error) {
      console.error("Failed to delete inventory:", error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting your inventory.",
        variant: "destructive",
      });
    }
  };

  // Group inventory by product category for the chart
  const categoryData = inventory.reduce((acc, item) => {
    const category = item.product.category;
    const existingCategory = acc.find(c => c.name === category);
    
    if (existingCategory) {
      existingCategory.value += item.quantity;
    } else {
      acc.push({ name: category, value: item.quantity });
    }
    
    return acc;
  }, [] as { name: string; value: number }[]);

  // Calculate inventory statistics
  const totalItems = inventory.length;
  const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Inventory Management</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? "Cancel" : "Add New Item"}</Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Inventory Item</CardTitle>
            <CardDescription>Enter the details of the new cassava batch</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="batch">Batch Number</Label>
                  <Input
                    id="batch"
                    value={newItem.batch}
                    onChange={(e) => setNewItem({ ...newItem, batch: e.target.value })}
                    placeholder="e.g., B-1006"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    placeholder="e.g., 500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quality">Quality Grade</Label>
                  <Select value={newItem.quality} onValueChange={(value) => setNewItem({ ...newItem, quality: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Grade A">Grade A</SelectItem>
                      <SelectItem value="Grade B">Grade B</SelectItem>
                      <SelectItem value="Grade C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={newItem.harvestDate}
                    onChange={(e) => setNewItem({ ...newItem, harvestDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Inventory Item
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${inventory.length > 0 
                ? (inventory.reduce((sum, item) => sum + item.product.price, 0) / inventory.length).toFixed(2) 
                : '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory by Category</CardTitle>
            <CardDescription>Distribution of cassava products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}kg`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} kg`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-muted-foreground">No inventory data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
            <CardDescription>Latest additions to your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
              </div>
            ) : inventory.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">No inventory items found</p>
                <Button onClick={() => setShowAddForm(true)} className="mt-4">
                  Add your first item
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {inventory.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between space-x-4 rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} kg | {item.warehouse.name}
                      </p>
                    </div>
                    <div>${item.product.price.toFixed(2)}/kg</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your current inventory stock</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            </div>
          ) : inventory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-muted-foreground">No inventory items found</p>
              <Button onClick={() => setShowAddForm(true)} className="mt-4">
                Add your first item
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Warehouse</TableHead>
                  <TableHead>Quantity (kg)</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventory.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.product.name}</TableCell>
                    <TableCell>{item.product.category}</TableCell>
                    <TableCell>{item.warehouse.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.product.price.toFixed(2)}/kg</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditClick(item)}
                        className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(item)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Inventory Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Inventory</DialogTitle>
            <DialogDescription>
              Update the quantity of this inventory item.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="product-name" className="text-right">
                  Product
                </Label>
                <div className="col-span-3">
                  <Input
                    id="product-name"
                    value={currentItem.product.name}
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="inventory-quantity" className="text-right">
                  Quantity (kg)
                </Label>
                <div className="col-span-3">
                  <Input
                    id="inventory-quantity"
                    type="number"
                    value={editForm.quantity}
                    onChange={(e) => setEditForm({ ...editForm, quantity: Number(e.target.value) })}
                    min={1}
                  />
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)} className="text-gray-700 border-gray-300">
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} className="bg-amber-600 hover:bg-amber-700">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this inventory item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {currentItem && (
            <div className="py-4">
              <p><strong>Product:</strong> {currentItem.product.name}</p>
              <p><strong>Quantity:</strong> {currentItem.quantity} kg</p>
              <p><strong>Warehouse:</strong> {currentItem.warehouse.name}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="text-gray-700 border-gray-300">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

