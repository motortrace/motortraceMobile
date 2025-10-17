// src/utils/authStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@MT_AUTH_TOKEN";

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export async function setSupabaseUserId(id: string) {
  await AsyncStorage.setItem('supabaseUserId', id);
}

export async function getSupabaseUserId(): Promise<string | null> {
  return await AsyncStorage.getItem('supabaseUserId');
}

export async function removeSupabaseUserId() {
  await AsyncStorage.removeItem('supabaseUserId');
}