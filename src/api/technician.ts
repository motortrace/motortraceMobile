import { API_BASE_URL } from '../constants/api';
import { getToken } from '../utils/authStorage';

export async function getAuthMe() {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch user info');
  return res.json();
}

export async function getTechnicianWorkOrders(technicianId: string) {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}/technicians/${technicianId}/work-orders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch work orders');
  return res.json();
}
