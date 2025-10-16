// src/api/auth.ts
import api from "./api";
import { saveToken, removeToken } from "../utils/authStorage";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    isRegistrationComplete: boolean;
  };
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  const { access_token } = response.data.data;
  await saveToken(access_token);
  return response.data.data;
};

export const logout = async () => {
  await api.post("/auth/logout");
  await removeToken();
};
