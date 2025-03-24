'use server'

import { db } from '@/db';
import { inventory, products } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

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

// Mock data - in a real app, this would be in the database
const processingBatches: ProcessingBatch[] = [
  {
    id: 1,
    batchId: "PB-1001",
    product: "Cassava Flour",
    rawMaterial: "RM-1003",
    quantity: 1200,
    startDate: "2023-11-01",
    endDate: "2023-11-03",
    status: "In Progress",
    progress: 65,
  },
  {
    id: 2,
    batchId: "PB-1002",
    product: "Cassava Starch",
    rawMaterial: "RM-0998",
    quantity: 800,
    startDate: "2023-10-30",
    endDate: "2023-11-02",
    status: "Completed",
    progress: 100,
  },
  {
    id: 3,
    batchId: "PB-1003",
    product: "Cassava Chips",
    rawMaterial: "RM-0999",
    quantity: 500,
    startDate: "2023-10-29",
    endDate: "2023-10-31",
    status: "Completed",
    progress: 100,
  },
  {
    id: 4,
    batchId: "PB-1004",
    product: "Cassava Flour",
    rawMaterial: "RM-1000",
    quantity: 1000,
    startDate: "2023-10-28",
    endDate: "2023-10-30",
    status: "Completed",
    progress: 100,
  },
];

// Raw materials mock data
const rawMaterials = [
  {
    id: 1,
    batchId: "RM-1001",
    supplier: "Farm A",
    quantity: 1500,
    quality: "Grade A",
    receivedDate: "2023-10-28",
    status: "Available",
  },
  {
    id: 2,
    batchId: "RM-1002",
    supplier: "Farm B",
    quantity: 2000,
    quality: "Grade B",
    receivedDate: "2023-10-30",
    status: "Available",
  },
  {
    id: 3,
    batchId: "RM-1003",
    supplier: "Farm C",
    quantity: 1200,
    quality: "Grade A",
    receivedDate: "2023-11-02",
    status: "In Processing",
  },
  {
    id: 4,
    batchId: "RM-1004",
    supplier: "Farm D",
    quantity: 800,
    quality: "Grade A",
    receivedDate: "2023-11-03",
    status: "Available",
  },
  {
    id: 5,
    batchId: "RM-1005",
    supplier: "Farm A",
    quantity: 1000,
    quality: "Grade B",
    receivedDate: "2023-11-04",
    status: "Available",
  },
];

// Get all processing batches
export async function getProcessingBatches() {
  // In a real app, this would be a database query
  return processingBatches;
}

// Get raw materials
export async function getRawMaterials() {
  // In a real app, this would be a database query
  return rawMaterials;
}

// Get a specific raw material by ID
export async function getRawMaterialById(id: number) {
  return rawMaterials.find(material => material.id === id);
}

// Get a specific processing batch by ID
export async function getProcessingBatchById(id: number) {
  return processingBatches.find(batch => batch.id === id);
}

// Process a raw material (start processing)
export async function processRawMaterial(materialId: number, productType: string, quantity: number, endDate: string) {
  // In a real app, this would update the database
  // 1. Update the raw material status to "In Processing"
  // 2. Create a new processing batch

  // Find the raw material to process
  const materialIndex = rawMaterials.findIndex(material => material.id === materialId);
  if (materialIndex === -1) {
    throw new Error("Raw material not found");
  }

  // Update the material status
  rawMaterials[materialIndex].status = "In Processing";

  // Create a new processing batch
  const newBatchId = `PB-${1000 + processingBatches.length + 1}`;
  const startDate = new Date().toISOString().split('T')[0];
  
  const newBatch: ProcessingBatch = {
    id: processingBatches.length + 1,
    batchId: newBatchId,
    product: productType,
    rawMaterial: rawMaterials[materialIndex].batchId,
    quantity: quantity,
    startDate: startDate,
    endDate: endDate,
    status: "In Progress",
    progress: 0,
  };

  processingBatches.push(newBatch);
  
  return newBatch;
}

// Update a processing batch progress
export async function updateProcessingBatch(batchId: number, progress: number, status?: 'In Progress' | 'Completed' | 'Canceled') {
  // In a real app, this would update the database
  const batchIndex = processingBatches.findIndex(batch => batch.id === batchId);
  
  if (batchIndex === -1) {
    throw new Error("Processing batch not found");
  }

  // Update the batch
  processingBatches[batchIndex].progress = progress;
  
  if (status) {
    processingBatches[batchIndex].status = status;
  } else if (progress >= 100) {
    processingBatches[batchIndex].status = "Completed";
  }

  // If batch is completed, update inventory
  if ((status === "Completed" || progress >= 100) && processingBatches[batchIndex].status !== "Completed") {
    processingBatches[batchIndex].status = "Completed";
    processingBatches[batchIndex].progress = 100;
    
    // In a real app, this would increase product inventory
    try {
      // This is a simulated inventory update - in a real app, 
      // you would find the product ID and increase its inventory
      const productsResult = await db.select().from(products)
        .where(eq(products.name, processingBatches[batchIndex].product))
        .limit(1);
      
      if (productsResult.length > 0) {
        const productId = productsResult[0].id;
        // Update product stock
        await db.update(products)
          .set({ stock: productsResult[0].stock + processingBatches[batchIndex].quantity })
          .where(eq(products.id, productId));
      }
    } catch (error) {
      console.error("Failed to update inventory:", error);
    }
  }
  
  return processingBatches[batchIndex];
}

// View details for a batch or material
export async function getDetails(type: 'batch' | 'material', id: number) {
  if (type === 'batch') {
    return getProcessingBatchById(id);
  } else {
    return getRawMaterialById(id);
  }
} 