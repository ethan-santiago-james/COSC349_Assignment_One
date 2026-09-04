
// Initial implementation generated with OpenAI Codex.
// Reviewed and modified by Ethan James, including changes to
// message styling and sender identification.

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://192.168.56.11:3000';


export type User = { username: string; first_name: string; last_name: string };
export type MeetRequest = { sender: string; receiver: string; Time_Of_Send: string; Status: string };
export type Message = { id?: number; from_user: string; to_user: string; content: string };

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  const text = await response.text();
  return text ? JSON.parse(text) as T : undefined as T;
}

export const api = {
  signup: (body: Record<string, string>) => request<void>('/signup', { method: 'POST', body: JSON.stringify(body) }),
  login: (username: string, password: string) => request<void>('/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  users: () => request<User[]>('/get_users'),
  meetRequests: (username: string) => request<MeetRequest[]>(`/meet_requests?username=${encodeURIComponent(username)}`),
  hasAcceptedRequest: (sender: string, receiver: string) => request<{ hasAcceptedRequest: boolean }>(`/has_accepted_meet_request?sender=${encodeURIComponent(sender)}&receiver=${encodeURIComponent(receiver)}`),
  sendMeetRequest: (sender: string, receiver: string) => request<void>('/send_meet_request', { method: 'POST', body: JSON.stringify({ sender, receiver, timeOfSend: new Date().toISOString() }) }),
  createConnection: (usernameOne: string, usernameTwo: string) => request<void>('/user_connection/', { method: 'POST', body: JSON.stringify({ usernameOne, usernameTwo }) }),
  connections: (username: string) => request<User[]>(`/user_connections?username=${encodeURIComponent(username)}`),
  messages: (usernameOne: string, usernameTwo: string) => request<Message[]>(`/chats?usernameOne=${encodeURIComponent(usernameOne)}&usernameTwo=${encodeURIComponent(usernameTwo)}`),
  sendMessage: (sender: string, recipient: string, content: string) => request<Message>('/chat', { method: 'POST', body: JSON.stringify({ sender, recipient, content }) }),
};
