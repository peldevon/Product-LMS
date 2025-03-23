import { useState, useEffect } from "react"
import { getWarehouses } from "@/app/actions/inventory"
import { Eye, Settings } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { updateWarehouse } from "@/app/actions/inventory"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TableCell } from "@/components/ui/table"

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

  return (
    <div>
      {/* ... existing code ... */}

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
              <Button variant="outline" onClick={() => setShowManage(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleManageSubmit}
                disabled={manageForm.capacity < selectedWarehouse.used}
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