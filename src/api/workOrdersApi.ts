// src/api/workOrders.ts
import api from "./api"; // your Axios instance
import { getToken } from "../utils/authStorage";

export interface WorkOrder {
  id: string;
  system: string;
  carModel: string;
  carPlate: string;
  date: string;
  technician: string;
  tasks: { taskId: string; description: string; status: string; estimatedTime: number; actualTime: number }[];
  parts: { inventoryItemId: string; name: string; quantity: number; unitPrice: number; notes: string; installed: boolean; installedAt?: string }[];
}

export const getAssignedWorkOrders = async (technicianId: string): Promise<WorkOrder[]> => {
  const token = await getToken();
  const response = await api.get("/work-orders", {
    params: { technicianId },
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.data; // adjust if your backend wraps differently
};
