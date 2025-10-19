import { BASE_URL } from "./constants";

const clearTokenAndLogout = () => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('username');
    window.location.href = '/login';
}

export const checkUserToken = async() => {
    const token = window.localStorage.getItem('token');
    if (!token) {
        clearTokenAndLogout();
        return;
    }
    const response = await fetch(`${BASE_URL}/get-user-token`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    if (response.status !== 200) {
        clearTokenAndLogout();
        return;
    }
}