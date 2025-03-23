'use client';

// Import required functions from actions
import { deleteOrder, updateOrder, getOrderById, getOrderItems } from "@/app/actions/order";
import { getShipments, deleteShipment, updateShipment } from "@/app/actions/shipments";
import { updateInventoryQuantity, deleteInventoryEntry } from "@/app/actions/inventory";
import { deleteUser, updateUserStatus } from "@/app/actions/user";

// Generic type for handlers with any payload
type ActionHandler<T> = (payload: T) => Promise<void>;

// Order Handlers
export const orderHandlers = {
  // View order details - returns the order and its items
  viewOrder: async (orderId: number) => {
    try {
      const order = await getOrderById(orderId);
      if (!order) throw new Error("Order not found");
      
      const items = await getOrderItems(orderId);
      return { ...order, orderItems: items };
    } catch (error) {
      console.error("Error viewing order:", error);
      throw error;
    }
  },
  
  // Delete an order
  deleteOrder: async (orderId: number) => {
    try {
      if (!window.confirm("Are you sure you want to delete this order?")) return;
      await deleteOrder(orderId);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  },
  
  // Update order status
  updateOrderStatus: async (orderId: number, status: string) => {
    try {
      await updateOrder(orderId, { status: status as any });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  }
};

// Shipment Handlers
export const shipmentHandlers = {
  // View shipment details
  viewShipment: async (shipmentId: number) => {
    try {
      const shipments = await getShipments();
      return shipments.find(s => s.id === shipmentId);
    } catch (error) {
      console.error("Error viewing shipment:", error);
      throw error;
    }
  },
  
  // Create a new shipment
  createShipment: async (shipmentData: any) => {
    try {
      const { createShipment } = await import('@/app/actions/shipments');
      return await createShipment(shipmentData);
    } catch (error) {
      console.error("Error creating shipment:", error);
      throw error;
    }
  },
  
  // Delete a shipment
  deleteShipment: async (shipmentId: number) => {
    try {
      if (!window.confirm("Are you sure you want to delete this shipment?")) return;
      await deleteShipment(shipmentId);
    } catch (error) {
      console.error("Error deleting shipment:", error);
      throw error;
    }
  },
  
  // Update shipment status
  updateShipmentStatus: async (shipmentId: number, status: string) => {
    try {
      await updateShipment(shipmentId, { status: status as any });
    } catch (error) {
      console.error("Error updating shipment status:", error);
      throw error;
    }
  }
};

// Inventory Handlers
export const inventoryHandlers = {
  // Update inventory quantity
  updateInventoryQuantity: async (inventoryId: number, quantity: number) => {
    try {
      const newQuantity = window.prompt("Enter new quantity:", quantity.toString());
      if (!newQuantity) return;
      
      const parsedQuantity = parseInt(newQuantity);
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        alert("Please enter a valid quantity");
        return;
      }
      
      await updateInventoryQuantity(inventoryId, parsedQuantity);
    } catch (error) {
      console.error("Error updating inventory quantity:", error);
      throw error;
    }
  },
  
  // Delete inventory entry
  deleteInventory: async (inventoryId: number) => {
    try {
      if (!window.confirm("Are you sure you want to delete this inventory entry?")) return;
      await deleteInventoryEntry(inventoryId);
    } catch (error) {
      console.error("Error deleting inventory entry:", error);
      throw error;
    }
  }
};

// User Handlers
export const userHandlers = {
  // Toggle user status (activate/deactivate)
  toggleUserStatus: async (userId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      
      if (!window.confirm(`Are you sure you want to ${newStatus === "Active" ? "activate" : "deactivate"} this user?`)) return;
      
      await updateUserStatus(userId, newStatus as "Active" | "Inactive");
    } catch (error) {
      console.error("Error toggling user status:", error);
      throw error;
    }
  },
  
  // Delete a user
  deleteUser: async (userId: number) => {
    try {
      if (!window.confirm("Are you sure you want to delete this user?")) return;
      await deleteUser(userId);
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  }
}; 