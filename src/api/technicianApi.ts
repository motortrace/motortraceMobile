// src/api/technicianApi.ts

const BASE_URL = "http://192.168.111.149:3000";

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
export async function fetchTechnicianWorkOrders(technicianId: string, token: string): Promise<any[]> {
  const res = await fetch(`${BASE_URL}/technicians/${technicianId}/work-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data || [];
}