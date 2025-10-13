<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { BASE_URL } from '@/utils/constants';
import { showToast } from '@/utils/toastsService';

const router = useRouter();
const username = ref('');
const password = ref('');
const showPassword = ref(false);

const signup = async() => {
    try {
        if(!checkUnameValidity() || !checkPwdValidity()) {
            showToast('Invalid username or password', 'error');
            throw new Error('Invalid username or password format');
        }
        const response = await fetch(`${BASE_URL}/signup`, {
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
            const errorMsg = (await response.json()).message || 'Signup failed';
            showToast(errorMsg, 'error');
            throw new Error(errorMsg);
        }
        showToast('Signup successful!', 'success');
        router.push('/login');
    } catch (error: any) {
        console.error('Error during signup:', error.message);
    }
};

/**
 * Check if the username is valid according to predefined criteria - Alphanumeric and underscores, 3-20 characters long.
 * @returns {boolean} True if the username is valid, false otherwise.
 */
const checkUnameValidity = () => {
    return /^[a-zA-Z0-9_\.]{3,20}$/.test(username.value);
};

/**
 * Check if the password is valid according to predefined criteria - At least 6 characters long.
 * @returns {boolean} True if the password is valid, false otherwise.
 */
const checkPwdValidity = () => {
    return password.value.length >= 6;
};
</script>

<template>
    <div class="auth-container">
        <div class="auth-box">
            <h1>Signup</h1>
            <div class="form-group">
                <label>Username</label>
                <input type="text" v-model="username" />
                <div v-if="username" :class="['validation-message', checkUnameValidity() ? 'success' : 'error']">
                    <span class="validation-icon">{{ checkUnameValidity() ? '✓' : '✗' }}</span>
                    <span v-if="checkUnameValidity()">
                        Username looks good!
                    </span>
                    <span v-else>
                        Username must be 3-20 characters long and can only contain letters, numbers, underscores and '.'.
                    </span>
                </div>
            </div>
            <div class="form-group">
                <label>Password</label>
                <div class="password-input-wrapper">
                    <input :type="showPassword ? 'text' : 'password'" v-model="password" />
                    <button type="button" class="password-toggle-btn" @click="showPassword = !showPassword">
                        {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                    </button>
                </div>
                <div v-if="password" :class="['validation-message', checkPwdValidity() ? 'success' : 'error']">
                    <span class="validation-icon">{{ checkPwdValidity() ? '✓' : '✗' }}</span>
                    <span v-if="checkPwdValidity()">
                        Password is strong enough!
                    </span>
                    <span v-else>
                        Password must be at least 6 characters long.
                    </span>
                </div>
            </div>
            <div>
                <button type="button" class="auth-button" @click="signup">Sign Up Here</button>
            </div>
            <div class="auth-link-container">
                <p>Already have an account?</p>
                <a class="auth-link" @click="router.push('/login')">Login here</a>
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