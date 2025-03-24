"use client"

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChevronRightIcon, LineChartIcon, PieChartIcon, ActivityIcon } from 'lucide-react';
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
import { Slider } from '@/components/ui/slider';
import { getRawMaterials, getProcessingBatches, getProcessingBatchById, updateProcessingBatch } from '@/app/actions/processing';
import { toast } from '@/components/ui/use-toast';

type ProcessingBatch = {
  id: number;
  batchId: string;
  product: string;
  rawMaterial: string;
  quantity: number;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Completed' | 'Canceled';
  progress: number;
};

export default function ProcessorProcessingPage() {
  const [processingBatches, setProcessingBatches] = useState<ProcessingBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewBatchForm, setShowNewBatchForm] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProcessingBatch | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    progress: 0,
    status: 'In Progress' as 'In Progress' | 'Completed' | 'Canceled'
  });

  // Fetch processing batches data
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getProcessingBatches();
        setProcessingBatches(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching processing batches:', error);
        toast({
          title: 'Error',
          description: 'Failed to load processing batches. Please try again.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Handler for viewing batch details
  const handleViewDetails = async (batch: ProcessingBatch) => {
    try {
      setLoading(true);
      const details = await getProcessingBatchById(batch.id);
      setSelectedBatch(details || null);
      setShowDetailsDialog(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batch details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load batch details. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Handler for opening update dialog
  const handleOpenUpdateDialog = async (batch: ProcessingBatch) => {
    try {
      setLoading(true);
      const details = await getProcessingBatchById(batch.id);
      setSelectedBatch(details || null);
      setUpdateForm({
        progress: details?.progress || 0,
        status: details?.status || 'In Progress'
      });
      setShowUpdateDialog(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching batch details for update:', error);
      toast({
        title: 'Error',
        description: 'Failed to load batch details. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Handler for submitting update form
  const handleUpdateSubmit = async () => {
    if (!selectedBatch) return;
    
    try {
      setLoading(true);
      
      // Update the processing batch
      const updatedBatch = await updateProcessingBatch(
        selectedBatch.id,
        updateForm.progress,
        updateForm.status
      );
      
      // Update the local state
      setProcessingBatches(prevBatches => 
        prevBatches.map(batch => 
          batch.id === selectedBatch.id 
            ? updatedBatch 
            : batch
        )
      );
      
      // Show success message
      toast({
        title: 'Batch Updated',
        description: `Batch ${selectedBatch.batchId} has been updated.`,
      });
      
      setShowUpdateDialog(false);
      setSelectedBatch(null);
      setLoading(false);
    } catch (error) {
      console.error('Error updating batch:', error);
      toast({
        title: 'Error',
        description: 'Failed to update batch. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  // Calculate stats for the dashboard
  const totalActiveBatches = processingBatches.filter(batch => batch.status === 'In Progress').length;
  const totalCompletedBatches = processingBatches.filter(batch => batch.status === 'Completed').length;
  const totalQuantity = processingBatches.reduce((sum, batch) => sum + batch.quantity, 0);
  
  // Filter active and completed batches
  const activeBatches = processingBatches.filter(batch => batch.status === 'In Progress');
  const completedBatches = processingBatches.filter(batch => batch.status === 'Completed');
  
  // Prepare chart data
  const statusChartData = [
    { name: 'In Progress', value: totalActiveBatches, color: '#f59e0b' },
    { name: 'Completed', value: totalCompletedBatches, color: '#10b981' },
  ];

  // Sample efficiency data
  const efficiencyData = [
    { name: 'Cassava Flour', efficiency: 92 },
    { name: 'Cassava Starch', efficiency: 87 },
    { name: 'Cassava Chips', efficiency: 95 },
  ];

  // Handler for new batch form submission
  const handleNewBatchSubmit = () => {
    // In a real app, this would create a new batch
    toast({
      title: "New Batch Created",
      description: "Your new processing batch has been created.",
    });
    setShowNewBatchForm(false);
  };

  return (
    <DashboardShell>
      <DashboardHeader heading="Processing Operations" text="Track and manage your processing operations.">
        <Button onClick={() => setShowNewBatchForm(!showNewBatchForm)}>
          {showNewBatchForm ? 'Cancel' : 'New Batch'}
        </Button>
      </DashboardHeader>

      {showNewBatchForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Start New Batch</CardTitle>
            <CardDescription>Create a new processing batch</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product-type">Product Type</Label>
                <Select defaultValue="cassava-flour">
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cassava-flour">Cassava Flour</SelectItem>
                    <SelectItem value="cassava-starch">Cassava Starch</SelectItem>
                    <SelectItem value="cassava-chips">Cassava Chips</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="raw-material">Raw Material</Label>
                <Select defaultValue="rm-1001">
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rm-1001">RM-1001 (Farm A)</SelectItem>
                    <SelectItem value="rm-1002">RM-1002 (Farm B)</SelectItem>
                    <SelectItem value="rm-1004">RM-1004 (Farm D)</SelectItem>
                    <SelectItem value="rm-1005">RM-1005 (Farm A)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (kg)</Label>
                <Input id="quantity" type="number" min="100" step="100" defaultValue="1000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input 
                  id="end-date" 
                  type="date" 
                  defaultValue={new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0]} 
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleNewBatchSubmit}>
              Start Batch
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processing Overview</CardTitle>
            <ActivityIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveBatches + totalCompletedBatches} batches</div>
            <p className="text-xs text-muted-foreground">
              {totalActiveBatches} active · {totalCompletedBatches} completed
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
            <CardTitle className="text-sm font-medium">Processing Efficiency</CardTitle>
            <LineChartIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91.3%</div>
            <p className="text-xs text-muted-foreground">
              Average processing efficiency
            </p>
            <div className="h-[120px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={efficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickMargin={5} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickMargin={5} />
                  <Tooltip />
                  <Bar dataKey="efficiency" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Processing Volume</CardTitle>
            <PieChartIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalQuantity} kg</div>
            <p className="text-xs text-muted-foreground">
              Total volume processed
            </p>
            <div className="h-[120px] mt-4 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{totalQuantity / 1000}</div>
                <div className="text-xs text-muted-foreground">Metric Tons</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processing Batches</CardTitle>
          <CardDescription>
            Manage all processing batches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Batches</TabsTrigger>
              <TabsTrigger value="completed">Completed Batches</TabsTrigger>
            </TabsList>
            <TabsContent value="active">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Raw Material</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.batchId}</TableCell>
                        <TableCell>{batch.product}</TableCell>
                        <TableCell>{batch.rawMaterial}</TableCell>
                        <TableCell>{batch.quantity}</TableCell>
                        <TableCell>{batch.startDate}</TableCell>
                        <TableCell>{batch.endDate}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="bg-gray-200 w-24 h-2 rounded-full overflow-hidden">
                              <div 
                                className="bg-blue-500 h-full" 
                                style={{ width: `${batch.progress}%` }}
                              ></div>
                            </div>
                            <span>{batch.progress}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(batch)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                            View
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleOpenUpdateDialog(batch)} className="text-amber-600 hover:text-amber-800 hover:bg-amber-100">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="completed">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch ID</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Raw Material</TableHead>
                      <TableHead>Quantity (kg)</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedBatches.map((batch) => (
                      <TableRow key={batch.id}>
                        <TableCell className="font-medium">{batch.batchId}</TableCell>
                        <TableCell>{batch.product}</TableCell>
                        <TableCell>{batch.rawMaterial}</TableCell>
                        <TableCell>{batch.quantity}</TableCell>
                        <TableCell>{batch.startDate}</TableCell>
                        <TableCell>{batch.endDate}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {batch.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handleViewDetails(batch)} className="text-blue-600 hover:text-blue-800 hover:bg-blue-100">
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Batch Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Batch Details</DialogTitle>
            <DialogDescription>
              Detailed information about the selected processing batch.
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Batch ID</Label>
                <div className="col-span-3">{selectedBatch.batchId}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Product</Label>
                <div className="col-span-3">{selectedBatch.product}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Raw Material</Label>
                <div className="col-span-3">{selectedBatch.rawMaterial}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Quantity</Label>
                <div className="col-span-3">{selectedBatch.quantity} kg</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Start Date</Label>
                <div className="col-span-3">{selectedBatch.startDate}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">End Date</Label>
                <div className="col-span-3">{selectedBatch.endDate}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3">
                  <Badge variant={selectedBatch.status === 'Completed' ? 'outline' : 'secondary'} className={selectedBatch.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : ''}>
                    {selectedBatch.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Progress</Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 w-full h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-500 h-full" 
                        style={{ width: `${selectedBatch.progress}%` }}
                      ></div>
                    </div>
                    <span>{selectedBatch.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetailsDialog(false)} className="bg-gray-500 hover:bg-gray-600">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Batch Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Batch</DialogTitle>
            <DialogDescription>
              Update the progress or status of this processing batch.
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Batch ID</Label>
                <div className="col-span-3">{selectedBatch.batchId}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Product</Label>
                <div className="col-span-3">{selectedBatch.product}</div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="progress">Progress</Label>
                <div className="col-span-3 space-y-2">
                  <Slider 
                    id="progress" 
                    defaultValue={[updateForm.progress]} 
                    max={100} 
                    step={5}
                    onValueChange={(value) => setUpdateForm({...updateForm, progress: value[0]})}
                  />
                  <div className="flex justify-between">
                    <span>0%</span>
                    <span>{updateForm.progress}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right" htmlFor="status">Status</Label>
                <Select 
                  value={updateForm.status} 
                  onValueChange={(value: 'In Progress' | 'Completed' | 'Canceled') => 
                    setUpdateForm({...updateForm, status: value})
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)} className="text-gray-700 border-gray-300">Cancel</Button>
            <Button onClick={handleUpdateSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
              {loading ? 'Updating...' : 'Update Batch'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardShell>
  )
}

