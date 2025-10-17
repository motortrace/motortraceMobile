// src/api/technicianApi.ts

const BASE_URL = "http://192.168.72.149:3000";

// 1. Get UserProfile by Supabase User ID
export async function fetchUserProfileId(supabaseUserId: string, token: string): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/user-profiles/search?supabaseUserId=${supabaseUserId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.id || (Array.isArray(data) && data[0]?.id) || null;
}

// 2. Get Technician by UserProfile ID
export async function fetchTechnicianId(userProfileId: string, token: string): Promise<string | null> {
  const res = await fetch(`${BASE_URL}/technicians/search?userProfileId=${userProfileId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.id || (Array.isArray(data) && data[0]?.id) || null;
}


// 3. Get Work Orders for Technician
export async function fetchTechnicianWorkOrders(technicianId: string, token: string, status?: string): Promise<any[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await fetch(`${BASE_URL}/technicians/${technicianId}/work-orders${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data || [];
}

// 8. Get detailed technician info (profile + stats + current work)
export async function fetchTechnicianDetails(technicianId: string, token: string): Promise<any | null> {
  const res = await fetch(`${BASE_URL}/technicians/${technicianId}/details`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  return data?.data || null;
}

// 4. Get Work Order Details by ID
export async function fetchWorkOrderDetails(workOrderId: string, token: string): Promise<any | null> {
  const res = await fetch(`${BASE_URL}/work-orders/${workOrderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data?.data || null;
}

// 5. Get Inspections assigned to Technician
export async function fetchTechnicianInspections(technicianId: string, token: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/inspection-templates/inspectors/${technicianId}/inspections`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data || [];
}

// 6. Get Inspection Report by ID
export async function fetchInspectionReport(inspectionId: string, token: string): Promise<any | null> {
  const res = await fetch(`${BASE_URL}/inspection-templates/inspections/${inspectionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch inspection report");
  const data = await res.json();
  return data?.data || data;
}

// Save completed inspection to backend
export async function updateWorkOrderInspection(inspectionId: string, updateData: any, token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/inspection-templates/inspections/${inspectionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error("Failed to update inspection");
  const data = await res.json();
  return data?.data || data;
}

// Update a single checklist item
export async function updateChecklistItem(checklistItemId: string, updateData: any, token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/inspection-templates/checklist-items/${checklistItemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error("Failed to update checklist item");
  const data = await res.json();
  return data?.data || data;
}

// Update labor task (start/stop)
export async function updateLaborTask(laborId: string, updateData: any, token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/work-orders/labor/${laborId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) {
    // Try to get server error message to surface to UI
    const text = await res.text().catch(() => null);
    throw new Error(text || `Failed to update labor task (status ${res.status})`);
  }
  const data = await res.json().catch(() => null);
  return data?.data || data;
}

// Upload Work Order Attachment
export async function uploadWorkOrderAttachment(
  workOrderId: string,
  fileAsset: { uri: string; fileName?: string; type?: string },
  description: string,
  category: string,
  token: string,
  supabaseUserId?: string | null
): Promise<any> {
  if (!token) throw new Error('Missing token for upload');

  // Build FormData. When running in React Native, pass the file object with uri/name/type
  // and do NOT set Content-Type header so the runtime can add the multipart boundary.
  const formData = new FormData();

  // Append the React Native file object directly. This avoids unreliable
  // fetch(uri)->blob conversions for content:// URIs on Android which often
  // fail with 'Network request failed'. The RN FormData runtime will handle
  // multipart boundaries correctly when Content-Type is not set manually.
  formData.append('file', {
    uri: fileAsset.uri,
    name: fileAsset.fileName || 'photo.jpg',
    type: fileAsset.type || 'image/jpeg',
  } as any);

  formData.append('description', description);
  formData.append('category', category);
  if (supabaseUserId) formData.append('uploadedBySupabaseId', supabaseUserId);

  const res = await fetch(`${BASE_URL}/work-orders/${workOrderId}/attachments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      // Do NOT set Content-Type for multipart in React Native; let the runtime set the
      // correct boundary. Setting this header manually often breaks uploads on Android/iOS.
    },
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || `Failed to upload attachment (status ${res.status})`);
  }

  // Parse JSON if present
  const data = await res.json().catch(() => null);
  return data?.data || data || null;
}

// Upload Inspection Attachment (multipart/form-data)
export async function uploadInspectionAttachment(
  inspectionId: string,
  fileAsset: { uri: string; fileName?: string; type?: string },
  checklistItemId?: string | null,
  token?: string
): Promise<any> {
  if (!token) throw new Error('Missing token for upload');
  const formData = new FormData();
  formData.append('file', {
    uri: fileAsset.uri,
    name: fileAsset.fileName || 'photo.jpg',
    type: fileAsset.type || 'image/jpeg',
  } as any);
  if (checklistItemId) formData.append('checklistItemId', checklistItemId);

  const res = await fetch(`${BASE_URL}/inspection-templates/inspections/${inspectionId}/attachments`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // Let RN set Content-Type and boundary automatically
    },
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to upload inspection attachment');
  const data = await res.json();
  return data?.data || data;
}

// 7. Get Parts for Work Order
export async function fetchWorkOrderParts(workOrderId: string, token: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/work-orders/${workOrderId}/parts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data || [];
}

// Update a work order part (e.g., mark as installed)
export async function updateWorkOrderPart(
  workOrderId: string,
  partId: string,
  updateData: any,
  token: string
): Promise<any> {
  const res = await fetch(`${BASE_URL}/work-orders/${workOrderId}/parts/${partId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error('Failed to update work order part');
  const data = await res.json();
  return data?.data || data;
}

// Complete a part installation (technician workflow)
export async function completePartInstallation(
  partId: string,
  payload: { notes?: string; warrantyInfo?: string } | any,
  token: string
): Promise<any> {
  // Note: in the backend the work-orders router is mounted at /work-orders
  // and the part lifecycle routes live under /work-orders/parts/:partId/...
  const res = await fetch(`${BASE_URL}/work-orders/parts/${partId}/complete`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || 'Failed to complete part installation');
  }
  const data = await res.json();
  return data?.data || data;
}

// Start part installation (technician marks work started)
export async function startPartInstallation(partId: string, token: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/work-orders/parts/${partId}/start`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || 'Failed to start part installation');
  }
  const data = await res.json().catch(() => null);
  return data?.data || data;
}

// Create a QC record for a work order (technician action)
export async function createWorkOrderQC(
  workOrderId: string,
  payload: { passed: boolean; inspectorId?: string; notes?: string; reworkRequired?: boolean; reworkNotes?: string },
  token: string
): Promise<any> {
  const res = await fetch(`${BASE_URL}/work-orders/${workOrderId}/qc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw new Error(text || 'Failed to create QC record');
  }
  const data = await res.json().catch(() => null);
  return data?.data || data;
}

// Fetch QC records for a work order
export async function getWorkOrderQC(workOrderId: string, token: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/work-orders/${workOrderId}/qc`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    // If 404 or no records, return empty array rather than throwing
    if (res.status === 404) return [];
    const text = await res.text().catch(() => null);
    throw new Error(text || `Failed to fetch QC records (status ${res.status})`);
  }
  const data = await res.json().catch(() => null);
  // backend returns { success: true, data: [...] } in many endpoints
  return data?.data || data || [];
}

