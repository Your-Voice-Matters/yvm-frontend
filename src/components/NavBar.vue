<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { setUsername } from "../utils/setUser";
import { usernameStore } from "../stores/username";

const router = useRouter();
const unmStore = usernameStore();
import getCSRFToken from '../utils/fetchCSRFtoken';

async function logout() {
    try {
        const csrfToken = await getCSRFToken();
        if (!csrfToken) {
            throw new Error('CSRF token missing');
        }
        const response = await fetch('http://localhost:8080/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-CSRF-Token': csrfToken,
            },
        });
        if (!response.ok) {
            throw new Error((await response.json()).message || 'Logout failed');
        }
        window.localStorage.removeItem('username');
        document.cookie = "cookieName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        router.push('/login');
    } catch (error: any) {
        console.error('Error during logout:', error.message);
    }
}

onMounted(() => {
    setUsername();
});
</script>

<template>
    <div class="nav-bar">
        <div>YourVoiceMatters</div>
        <button v-if="unmStore.get()" type="button" @click="logout">Logout</button>
        <div v-else style="display: flex; gap: 10px; align-items: center;">
            <button type="button" @click="router.push('/login')">Login</button>
            <button type="button" @click="router.push('/signup')">Sign Up</button>
        </div>
    </div>
</template>

<style scoped>
.nav-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
}

.nav-bar button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>