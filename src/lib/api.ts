import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

let apiClient: AxiosInstance;

export function initializeApiClient() {
  apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  );

  return apiClient;
}

export function getApiClient() {
  if (!apiClient) {
    return initializeApiClient();
  }
  return apiClient;
}

export async function login(username: string, password: string) {
  const response = await getApiClient().post('/api/auth/login', {
    username,
    password,
  });
  return response.data;
}

export async function register(username: string, password: string) {
  const response = await getApiClient().post('/api/auth/register', {
    username,
    password,
  });
  return response.data;
}

export async function getUserInfo() {
  const response = await getApiClient().get('/api/auth/me');
  return response.data;
}

export async function generateKey(key: string, cheatId: number, days: number) {
  const response = await getApiClient().post('/api/admin/keys/generate', {
    key,
    cheatId,
    days,
  });
  return response.data;
}

export async function getAllKeys(creator?: string) {
  const response = await getApiClient().get('/api/admin/keys', {
    params: { creator },
  });
  return response.data;
}

export async function banKey(key: string, reason: string) {
  const response = await getApiClient().post('/api/admin/keys/ban', {
    key,
    reason,
  });
  return response.data;
}

export async function unbanKey(key: string) {
  const response = await getApiClient().post('/api/admin/keys/unban', { key });
  return response.data;
}

export async function createCheat(
  name: string,
  filename: string,
  process: string,
  injection: string,
  external: boolean
) {
  const response = await getApiClient().post('/api/admin/cheats', {
    name,
    filename,
    process,
    injection,
    external,
  });
  return response.data;
}

export async function getAllCheats() {
  const response = await getApiClient().get('/api/admin/cheats');
  return response.data;
}

export async function updateCheatStatus(cheatId: number, status: string) {
  const response = await getApiClient().put(`/api/admin/cheats/${cheatId}/status`, {
    cheatId,
    status,
  });
  return response.data;
}

export async function getAllLogs(limit = 100, offset = 0) {
  const response = await getApiClient().get('/api/admin/logs', {
    params: { limit, offset },
  });
  return response.data;
}

export async function getAllBans() {
  const response = await getApiClient().get('/api/admin/bans');
  return response.data;
}

export async function banHwid(hwid: string, reason: string) {
  const response = await getApiClient().post('/api/admin/bans', {
    hwid,
    reason,
  });
  return response.data;
}

export async function unbanHwid(hwid: string) {
  const response = await getApiClient().delete(`/api/admin/bans/${hwid}`);
  return response.data;
}

export async function getKeyStats() {
  const response = await getApiClient().get('/api/admin/stats');
  return response.data;
}

export async function getAllLoaders() {
  const response = await getApiClient().get('/api/admin/loaders');
  return response.data;
}

export async function createLoader(name: string, version: string, file: string, requireFilenameMatch: boolean = false, loaderHash: string = '', enforceHashVerification: boolean = false) {
  const response = await getApiClient().post('/api/admin/loaders/create', {
    name,
    version,
    file,
    requireFilenameMatch,
    loaderHash: loaderHash || undefined,
    enforceHashVerification,
  });
  return response.data;
}

export async function updateLoaderVersion(loaderId: number, version: string) {
  const response = await getApiClient().post('/api/admin/loaders/update-version', {
    loaderId,
    version,
  });
  return response.data;
}

export async function updateLoader(loaderId: number, data: { name?: string; version?: string; file?: string; requireFilenameMatch?: boolean; loaderHash?: string; enforceHashVerification?: boolean }) {
  const response = await getApiClient().put(`/api/admin/loaders/${loaderId}`, data);
  return response.data;
}
