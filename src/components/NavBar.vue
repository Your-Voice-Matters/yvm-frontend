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
        <button v-if="unmStore.get()" type="button" class="logout-btn" @click="logout">Logout</button>
        <div v-else class="auth-buttons">
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
    padding: 1.25rem 2.5rem;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav-bar > div:first-child {
    font-size: 1.5rem;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.5px;
}

.nav-bar .auth-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
}

.nav-bar button {
    padding: 0.625rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.nav-bar button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.nav-bar button:active {
    transform: translateY(0);
}

.nav-bar button.logout-btn {
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.nav-bar button.logout-btn:hover {
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.4);
}

@media (max-width: 768px) {
    .nav-bar {
        padding: 1rem 1.5rem;
    }
    
    .nav-bar > div:first-child {
        font-size: 1.2rem;
    }
    
    .nav-bar button {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }
}
</style>