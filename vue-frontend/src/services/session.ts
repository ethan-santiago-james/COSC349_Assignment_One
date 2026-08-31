const usernameKey = 'collaborate.username';

export const getUsername = () => localStorage.getItem(usernameKey) ?? '';
export const isLoggedIn = () => Boolean(getUsername());
export const setUsername = (username: string) => localStorage.setItem(usernameKey, username);
export const clearSession = () => localStorage.removeItem(usernameKey);
