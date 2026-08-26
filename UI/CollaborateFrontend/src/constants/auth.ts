let loggedIn = false;
let currentUsername = '';

export function setLoggedIn(value: boolean) {
  loggedIn = value;
}

export function isLoggedIn() {
  return loggedIn;
}

export function setUsername(username: string) {
  currentUsername = username;
}

export function getUsername() {

  return currentUsername;
}