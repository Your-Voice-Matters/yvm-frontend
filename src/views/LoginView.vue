<script setup lang="ts">
    import { ref, onBeforeUnmount } from 'vue';
    import { useRouter } from 'vue-router';

    import { usernameStore } from '../stores/username';
    import { BASE_URL } from '@/utils/constants';
    import { showToast } from '@/utils/toastsService';

    const router = useRouter();
    const unmStore = usernameStore();
    const username = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const isLoggingIn = ref(false);

    const handleLogin = async() => {
        try {
            if (!username.value || !password.value) {
                showToast('Please enter both username and password.', 'error');
                throw new Error('Username or password is empty');
            }
            isLoggingIn.value = true;
            const response = await fetch(`${BASE_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
            });
            if(!response.ok) {
                let errorMsg = (await response.json()).message || 'Login failed';
                showToast(errorMsg, 'error');
                isLoggingIn.value = false;
                throw new Error(errorMsg);
            }
            const data = await response.json();
            window.localStorage.setItem('username', username.value);
            window.localStorage.setItem('token', data.token);
            unmStore.set(username.value);
            showToast('Login successful!', 'success');
            isLoggingIn.value = false;
            router.push('/home');
        } catch (error: any) {
            isLoggingIn.value = false;
            console.error('Error during login:', error.message);
        }
    };

    onBeforeUnmount(() => {
        username.value = '';
        password.value = '';
        isLoggingIn.value = false;
    });
</script>

<template>
    <div class="auth-container">
        <div class="auth-box">
            <h1>Login</h1>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" :disabled="isLoggingIn" />
            </div>
            <div class="form-group">
                <label>Password</label>
                <div class="password-input-wrapper">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" :disabled="isLoggingIn" />
                    <button type="button" class="password-toggle-btn" @click="showPassword = !showPassword" :disabled="isLoggingIn">
                        {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                    </button>
                </div>
            </div>
            <div>
                <button type="button" class="auth-button" :disabled="isLoggingIn" @click="handleLogin">
                    <span v-if="isLoggingIn" class="button-spinner"></span>
                    {{ isLoggingIn ? 'Logging in...' : 'Login Here' }}
                </button>
            </div>
            <div class="auth-link-container">
                <p>Don't have an account?</p>
                <a class="auth-link" @click="router.push('/signup')">Sign up here</a>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2rem;
}

.auth-box {
    background: white;
    padding: 3rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
    max-width: 450px;
}

.auth-box h1 {
    color: #667eea;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 2rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 600;
    font-size: 0.95rem;
}

.form-group input {
    width: 100%;
    padding: 0.875rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.password-input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.password-input-wrapper input {
    width: 100%;
    padding-right: 3rem;
}

.password-toggle-btn {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.2rem;
    color: #666;
    padding: 0.5rem;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.password-toggle-btn:hover {
    color: #667eea;
}

.validation-message {
    font-size: 0.85rem;
    margin-top: 0.5rem;
    line-height: 1.4;
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
}

.validation-message.error {
    color: #dc3545;
}

.validation-message.success {
    color: #28a745;
}

.validation-icon {
    flex-shrink: 0;
    margin-top: 0.1rem;
}

.error-message {
    color: #dc3545;
    font-size: 0.85rem;
    margin-top: 0.5rem;
    line-height: 1.4;
}

.auth-button {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    margin-top: 1rem;
}

.auth-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.auth-button:active {
    transform: translateY(0);
}

.auth-button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: none;
    position: relative;
    overflow: hidden;
}

.auth-button:disabled::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: loading-shimmer 1.5s infinite;
}

@keyframes loading-shimmer {
    0% {
        left: -100%;
    }
    100% {
        left: 100%;
    }
}

.button-spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 0.5rem;
    vertical-align: middle;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.auth-link-container {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e0e0e0;
}

.auth-link-container p {
    color: #666;
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
}

.auth-link {
    color: #667eea;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
}

.auth-link:hover {
    color: #764ba2;
    text-decoration: underline;
}
</style>