// Backend API bilan ishlash uchun yordamchilar

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
}

const TOKEN_KEY = 'lifesprint_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((data as any).error || 'Server xatosi.');
  }
  return data as T;
}

export function register(payload: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  return request<{ token: string; user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function login(payload: { email: string; password: string }) {
  return request<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function fetchMe() {
  return request<{ user: AuthUser }>('/api/auth/me');
}

export function fetchState<T = any>() {
  return request<{ state: T | null }>('/api/state');
}

export function saveState<T = any>(state: T) {
  return request<{ ok: boolean }>('/api/state', {
    method: 'PUT',
    body: JSON.stringify({ state }),
  });
}

export interface NotificationItem {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  read: number;
  created_at: string;
}

export function fetchNotifications() {
  return request<{ notifications: NotificationItem[]; unreadCount: number }>('/api/notifications');
}

export function markNotificationRead(id: number) {
  return request<{ ok: boolean }>(`/api/notifications/read/${id}`, { method: 'POST' });
}

export function markAllNotificationsRead() {
  return request<{ ok: boolean }>('/api/notifications/read-all', { method: 'POST' });
}

export function publishCourse(course: any) {
  return request<{ course: any; courses: any[] }>('/api/actions/publish-course', {
    method: 'POST',
    body: JSON.stringify({ course }),
  });
}

export function createGroup(group: any) {
  return request<{ group: any; groups: any[] }>('/api/actions/create-group', {
    method: 'POST',
    body: JSON.stringify({ group }),
  });
}

export function sendGroupMessage(groupId: string, message: any) {
  return request<{ ok: boolean; messages: any[] }>('/api/actions/send-message', {
    method: 'POST',
    body: JSON.stringify({ groupId, message }),
  });
}

export function issueCertificate(certificate: any) {
  return request<{ certificate: any; certificates: any[] }>('/api/actions/issue-certificate', {
    method: 'POST',
    body: JSON.stringify({ certificate }),
  });
}

export interface RewardResult {
  ok: boolean;
  deltaXp: number;
  deltaCoins: number;
  totalXp: number;
  totalCoins: number;
  level: number;
}

export function reward(action: string, payload?: any) {
  return request<RewardResult>('/api/actions/reward', {
    method: 'POST',
    body: JSON.stringify({ action, payload }),
  });
}

type Setter = (v: number) => void;

// Fire-and-forget helper: call API, then update local state on success
export function rewardAndUpdate(
  setXp: Setter,
  setCoins: Setter | null,
  setLevel: Setter | null,
  action: string,
  payload?: any
) {
  reward(action, payload).then(r => {
    setXp(r.totalXp);
    if (setCoins) setCoins(r.totalCoins);
    if (setLevel) setLevel(r.level);
  }).catch(() => {});
}
