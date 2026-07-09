// Backend API bilan ishlash uchun yordamchilar

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
}

const TOKEN_KEY = 'lifesprint_access_token';
const REFRESH_KEY = 'lifesprint_refresh_token';
const OLD_TOKEN_KEY = 'lifesprint_token';

// Clear old token format
localStorage.removeItem(OLD_TOKEN_KEY);

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function setRefreshToken(token: string | null) {
  if (token) localStorage.setItem(REFRESH_KEY, token);
  else localStorage.removeItem(REFRESH_KEY);
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  const rt = getRefreshToken();
  if (!rt) return false;
  try {
    const res = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        setRefreshToken(null);
        setToken(null);
      }
      return false;
    }
    const data = await res.json();
    setToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    return true;
  } catch {
    return false;
  }
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
    if (res.status === 401 && getRefreshToken()) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = tryRefresh().finally(() => { isRefreshing = false; refreshPromise = null; });
      }
      const refreshed = await refreshPromise;
      if (refreshed) {
        const newToken = getToken();
        const retry = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(newToken ? { Authorization: `Bearer ${newToken}` } : {}),
            ...(options.headers || {}),
          },
        });
        const retryData = await retry.json().catch(() => ({}));
        if (!retry.ok) throw new Error((retryData as any).error || 'Server xatosi.');
        return retryData as T;
      }
    }
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
  return request<{ accessToken?: string; refreshToken?: string; token?: string; user: AuthUser }>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    // Handle both old (token) and new (accessToken) response formats
    if (!res.accessToken && res.token) {
      (res as any).accessToken = res.token;
    }
    return res as { accessToken: string; refreshToken: string; user: AuthUser };
  });
}

export function login(payload: { email: string; password: string }) {
  return request<{ accessToken?: string; refreshToken?: string; token?: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }).then(res => {
    if (!res.accessToken && res.token) {
      (res as any).accessToken = res.token;
    }
    return res as { accessToken: string; refreshToken: string; user: AuthUser };
  });
}

export function fetchMe(signal?: AbortSignal) {
  return request<{ user: AuthUser }>('/api/auth/me', { signal });
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

export function enrollCourse(courseId: string) {
  return request<{ ok: boolean }>('/api/actions/enroll-course', {
    method: 'POST',
    body: JSON.stringify({ courseId }),
  });
}

export function fetchEnrolledCourses() {
  return request<{ courses: any[]; enrolledCourseIds: string[] }>('/api/actions/enrolled-courses');
}

export function fetchStudentGroups() {
  return request<{ groups: any[]; userName: string }>('/api/actions/student-groups');
}

export function fetchStudentTests() {
  return request<{ tests: any[]; groups: any[] }>('/api/actions/student-tests');
}

export function fetchStudentHomeworks() {
  return request<{ homeworks: any[]; groups: any[] }>('/api/actions/student-homeworks');
}

export function getAiRecommendations(context: string) {
  return request<{ recommendations: string }>('/api/gemini/recommendations', {
    method: 'POST',
    body: JSON.stringify({ context }),
  });
}

export function aiAnalyze(prompt: string, systemInstruction?: string) {
  return request<{ text: string }>('/api/gemini/analyze', {
    method: 'POST',
    body: JSON.stringify({ prompt, systemInstruction }),
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
