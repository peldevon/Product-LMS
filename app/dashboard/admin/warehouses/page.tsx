"use client"

import { useState, useEffect } from "react"
import { getWarehouses } from "@/app/actions/inventory"
import { Eye, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { updateWarehouse } from "@/app/actions/inventory"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type Warehouse = {
  id: number;
  name: string;
  location: string;
  capacity: number;
  used: number;
}

export default function AdminWarehousesPage() {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showManage, setShowManage] = useState(false)
  const [manageForm, setManageForm] = useState({
    capacity: 0
  })

  useEffect(() => {
    async function fetchWarehouses() {
      setLoading(true);
      try {
        const fetchedWarehouses = await getWarehouses();
        setWarehouses(fetchedWarehouses as Warehouse[]);
      } catch (error) {
        console.error('Failed to fetch warehouses:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWarehouses();
  }, []);

  const handleViewDetails = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowDetails(true);
  }

  const handleManage = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setManageForm({
      capacity: warehouse.capacity
    });
    setShowManage(true);
  }

  const handleManageSubmit = async () => {
    if (!selectedWarehouse) return;
    
    try {
      await updateWarehouse(selectedWarehouse.id, {
        capacity: manageForm.capacity
      });
      
      // Update local state
      setWarehouses(prev => 
        prev.map(w => 
          w.id === selectedWarehouse.id 
            ? { ...w, capacity: manageForm.capacity } 
            : w
        )
      );
      
      setShowManage(false);
      toast({
        title: "Warehouse updated",
        description: "Warehouse capacity has been updated successfully."
      });
    } catch (error) {
      console.error('Failed to update warehouse:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the warehouse.",
        variant: "destructive"
      });
    }
  }

  // Calculate total statistics
  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalUsed = warehouses.reduce((sum, w) => sum + w.used, 0);
  const availableSpace = totalCapacity - totalUsed;
  const utilizationRate = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Warehouse Management</h1>
      
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsed} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableSpace} kg</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilization Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(utilizationRate)}%</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Warehouses Table */}
      <Card>
        <CardHeader>
          <CardTitle>Warehouses</CardTitle>
          <CardDescription>
            Manage your warehouse locations and capacities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {warehouses.map((warehouse) => (
                  <TableRow key={warehouse.id}>
                    <TableCell className="font-medium">{warehouse.name}</TableCell>
                    <TableCell>{warehouse.location}</TableCell>
                    <TableCell>{warehouse.capacity} kg</TableCell>
                    <TableCell>{warehouse.used} kg</TableCell>
                    <TableCell>{warehouse.capacity - warehouse.used} kg</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="w-full max-w-24 bg-gray-200 rounded-full h-2.5">
                          <div
                            className={`h-2.5 rounded-full ${
                              (warehouse.used / warehouse.capacity) * 100 > 75
                                ? "bg-red-500"
                                : (warehouse.used / warehouse.capacity) * 100 > 50
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                100,
                                (warehouse.used / warehouse.capacity) * 100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <span className="text-sm">
                          {Math.round((warehouse.used / warehouse.capacity) * 100)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDetails(warehouse)}
                        title="View Details"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View Details</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleManage(warehouse)}
                        title="Manage Warehouse"
                        className="text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                      >
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Manage</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Warehouse Details Dialog */}
      {selectedWarehouse && (
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Warehouse Details: {selectedWarehouse.name}</DialogTitle>
              <DialogDescription>
                Complete information about this warehouse
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Name:</Label>
                <div className="col-span-2">{selectedWarehouse.name}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Location:</Label>
                <div className="col-span-2">{selectedWarehouse.location}</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Capacity:</Label>
                <div className="col-span-2">{selectedWarehouse.capacity} kg</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Used Space:</Label>
                <div className="col-span-2">{selectedWarehouse.used} kg</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Available Space:</Label>
                <div className="col-span-2">{selectedWarehouse.capacity - selectedWarehouse.used} kg</div>
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label className="font-medium">Utilization:</Label>
                <div className="col-span-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        (selectedWarehouse.used / selectedWarehouse.capacity) * 100 > 75
                          ? "bg-red-500"
                          : (selectedWarehouse.used / selectedWarehouse.capacity) * 100 > 50
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(
                          100,
                          (selectedWarehouse.used / selectedWarehouse.capacity) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm mt-1">
                    {Math.round((selectedWarehouse.used / selectedWarehouse.capacity) * 100)}%
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Manage Warehouse Dialog */}
      {selectedWarehouse && (
        <Dialog open={showManage} onOpenChange={setShowManage}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Manage Warehouse: {selectedWarehouse.name}</DialogTitle>
              <DialogDescription>
                Update warehouse capacity and settings
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="capacity" className="text-right">
                  Capacity (kg)
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={manageForm.capacity}
                  onChange={(e) => setManageForm({ ...manageForm, capacity: Number(e.target.value) })}
                  className="col-span-3"
                  min={selectedWarehouse.used}
                />
                {manageForm.capacity < selectedWarehouse.used && (
                  <p className="text-sm text-red-500 col-span-4 text-right">
                    Capacity cannot be less than current usage ({selectedWarehouse.used} kg)
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowManage(false)} className="text-gray-700 border-gray-300">
                Cancel
              </Button>
              <Button 
                onClick={handleManageSubmit}
                disabled={manageForm.capacity < selectedWarehouse.used}
                className="bg-green-600 hover:bg-green-700"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
} 