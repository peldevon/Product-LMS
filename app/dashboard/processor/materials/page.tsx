"use client"

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChevronRightIcon, LineChartIcon, PieChartIcon, ShoppingBasketIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { DashboardHeader } from '@/components/header';
import { DashboardShell } from '@/components/shell';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRawMaterials, getRawMaterialById, processRawMaterial } from '@/app/actions/processing';
import { toast } from '@/components/ui/use-toast';

type RawMaterial = {
  id: number;
  batchId: string;
  supplier: string;
  quantity: number;
  quality: string;
  receivedDate: string;
  status: string;
};

export default function ProcessorMaterialsPage() {
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [showProcessDialog, setShowProcessDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [processForm, setProcessForm] = useState({
    productType: 'Cassava Flour',
    quantity: 0,
    endDate: ''
  });

  // Fetch raw materials data
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRawMaterials();
        setRawMaterials(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching raw materials:', error);
        toast({
          title: 'Error',
          description: 'Failed to load raw materials. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Handler for opening the details dialog
  const handleViewDetails = async (material: RawMaterial) => {
    try {
      setLoading(true);
      const details = await getRawMaterialById(material.id);
      setSelectedMaterial(details || null);
      setShowDetailsDialog(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching material details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load material details. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Handler for opening the process dialog
  const handleOpenProcessDialog = async (material: RawMaterial) => {
    if (material.status !== 'Available') {
      toast({
        title: 'Cannot Process',
        description: 'This material is not available for processing.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      const details = await getRawMaterialById(material.id);
      setSelectedMaterial(details || null);
      setProcessForm({
        productType: 'Cassava Flour',
        quantity: details?.quantity || 0,
        endDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0],
      });
      setShowProcessDialog(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching material details for processing:', error);
      toast({
        title: 'Error',
        description: 'Failed to load material details. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Handler for submitting the process form
  const handleProcessSubmit = async () => {
    if (!selectedMaterial) return;
    
    try {
      setLoading(true);
      
      // Validate form
      if (!processForm.productType || processForm.quantity <= 0 || !processForm.endDate) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all fields correctly.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }
      
      // Process the raw material
      const result = await processRawMaterial(
        selectedMaterial.id,
        processForm.productType,
        processForm.quantity,
        processForm.endDate
      );
      
      // Update the local state
      setRawMaterials(prevMaterials => 
        prevMaterials.map(material => 
          material.id === selectedMaterial.id 
            ? { ...material, status: 'In Processing' } 
            : material
        )
      );
      
      // Show success message
      toast({
        title: 'Processing Started',
        description: `Batch ${result.batchId} has been created for processing ${processForm.productType}.`,
      });
      
      setShowProcessDialog(false);
      setSelectedMaterial(null);
      setLoading(false);
    } catch (error) {
      console.error('Error processing material:', error);
      toast({
        title: 'Error',
        description: 'Failed to process material. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Calculate stats for the dashboard
  const totalMaterials = rawMaterials.length;
  const availableMaterials = rawMaterials.filter(material => material.status === 'Available').length;
  const inProcessingMaterials = rawMaterials.filter(material => material.status === 'In Processing').length;
  const totalQuantity = rawMaterials.reduce((sum, material) => sum + material.quantity, 0);

  // Prepare chart data
  const statusChartData = [
    { name: 'Available', value: availableMaterials, color: '#10b981' },
    { name: 'In Processing', value: inProcessingMaterials, color: '#f59e0b' },
  ];

  const qualityChartData = [
    { name: 'Grade A', value: rawMaterials.filter(material => material.quality === 'Grade A').length, color: '#3b82f6' },
    { name: 'Grade B', value: rawMaterials.filter(material => material.quality === 'Grade B').length, color: '#6366f1' },
  ];

  // Sample monthly reception data
  const monthlyReceptionData = [
    { month: 'Jan', amount: 1200 },
    { month: 'Feb', amount: 1900 },
    { month: 'Mar', amount: 2400 },
    { month: 'Apr', amount: 1200 },
    { month: 'May', amount: 1800 },
    { month: 'Jun', amount: 2400 },
    { month: 'Jul', amount: 2100 },
    { month: 'Aug', amount: 2200 },
    { month: 'Sep', amount: 2500 },
    { month: 'Oct', amount: 2800 },
    { month: 'Nov', amount: 3000 },
    { month: 'Dec', amount: 2100 },
  ];

  return (
    <DashboardShell>
      <DashboardHeader heading="Raw Materials Management" text="Track, manage, and process raw materials for production.">
        <Button onClick={() => setShowOrderForm(!showOrderForm)}>
          {showOrderForm ? 'Cancel' : 'Order Materials'}
        </Button>
      </DashboardHeader>

      {showOrderForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Place New Order</CardTitle>
            <CardDescription>Request new raw materials for processing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Select defaultValue="farm-a">
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farm-a">Farm A</SelectItem>
                    <SelectItem value="farm-b">Farm B</SelectItem>
                    <SelectItem value="farm-c">Farm C</SelectItem>
                    <SelectItem value="farm-d">Farm D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">Quality</Label>
                <Select defaultValue="grade-a">
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grade-a">Grade A</SelectItem>
                    <SelectItem value="grade-b">Grade B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" type="number" min="100" step="100" defaultValue="1000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-date">Expected Delivery</Label>
                <Input 
                  id="delivery-date" 
                  type="date" 
                  defaultValue={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => {
              toast({
                title: "Order Placed",
                description: "Your order has been successfully placed.",
              });
              setShowOrderForm(false);
            }}>
              Submit Order
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Materials Overview</CardTitle>
            <ShoppingBasketIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMaterials} batches</div>
            <p className="text-xs text-muted-foreground">
              {availableMaterials} available · {inProcessingMaterials} in processing
            </p>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Quality Distribution</CardTitle>
            <PieChartIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity} kg</div>
            <p className="text-xs text-muted-foreground">
              Total raw material in inventory
            </p>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={qualityChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {qualityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Reception</CardTitle>
            <LineChartIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,000 kg</div>
            <p className="text-xs text-muted-foreground">
              Peak reception this year (November)
            </p>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyReceptionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} tickMargin={5} />
                  <YAxis tick={{ fontSize: 10 }} tickMargin={5} />
                  <Tooltip />
                  <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Materials Inventory</CardTitle>
          <CardDescription>
            Manage your raw materials and start processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Quantity (kg)</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>Received Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rawMaterials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">{material.batchId}</TableCell>
                    <TableCell>{material.supplier}</TableCell>
                    <TableCell>{material.quantity}</TableCell>
                    <TableCell>{material.quality}</TableCell>
                    <TableCell>{material.receivedDate}</TableCell>
                    <TableCell>
                      <Badge variant={material.status === 'Available' ? 'outline' : 'secondary'}>
                        {material.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewDetails(material)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                        View
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleOpenProcessDialog(material)}
                        disabled={material.status !== 'Available'}
                        className="text-green-600 hover:text-green-800 hover:bg-green-100"
                      >
                        Process
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Material Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Material Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected raw material.
            </DialogDescription>
          </DialogHeader>
          {selectedMaterial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Batch ID</Label>
                <div className="col-span-3">{selectedMaterial.batchId}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Supplier</Label>
                <div className="col-span-3">{selectedMaterial.supplier}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Quantity</Label>
                <div className="col-span-3">{selectedMaterial.quantity} kg</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Quality</Label>
                <div className="col-span-3">{selectedMaterial.quality}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Received Date</Label>
                <div className="col-span-3">{selectedMaterial.receivedDate}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">
                  <Badge variant={selectedMaterial.status === 'Available' ? 'outline' : 'secondary'}>
                    {selectedMaterial.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)} className="bg-gray-500 hover:bg-gray-600">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Process Material Dialog */}
      <Dialog open={showProcessDialog} onOpenChange={setShowProcessDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start Processing</DialogTitle>
            <DialogDescription>
              Create a new processing batch from this raw material.
            </DialogDescription>
          </DialogHeader>
          {selectedMaterial && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Batch ID</Label>
                <div className="col-span-3">{selectedMaterial.batchId}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Quality</Label>
                <div className="col-span-3">{selectedMaterial.quality}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="product-type">Product Type</Label>
                <Select 
                  value={processForm.productType} 
                  onValueChange={(value) => setProcessForm({...processForm, productType: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cassava Flour">Cassava Flour</SelectItem>
                    <SelectItem value="Cassava Starch">Cassava Starch</SelectItem>
                    <SelectItem value="Cassava Chips">Cassava Chips</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="quantity">Quantity (kg)</Label>
                <Input 
                  id="quantity" 
                  type="number" 
                  value={processForm.quantity}
                  onChange={(e) => setProcessForm({...processForm, quantity: parseInt(e.target.value) || 0})}
                  className="col-span-3" 
                  max={selectedMaterial.quantity}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="end-date">End Date</Label>
                <Input 
                  id="end-date" 
                  type="date" 
                  value={processForm.endDate}
                  onChange={(e) => setProcessForm({...processForm, endDate: e.target.value})}
                  className="col-span-3" 
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProcessDialog(false)} className="text-gray-700 border-gray-300">Cancel</Button>
            <Button onClick={handleProcessSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Processing...' : 'Start Processing'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  );
}

