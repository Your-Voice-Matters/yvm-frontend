import { usernameStore } from "../stores/username";

const unmStore = usernameStore();

/**
 * Sets the username in the store from localStorage if not already set.
 * @returns void
 */
export function setUsername() {
    if (unmStore.get()) return;
    unmStore.set(window.localStorage.getItem('username') || '');
}