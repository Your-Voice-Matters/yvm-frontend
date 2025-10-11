<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const username = ref('');
const password = ref('');

const signup = async() => {
    try {
        if(!checkUnameValidity() || !checkPwdValidity()) {
            throw new Error('Invalid username or password format');
        }
        const response = await fetch('http://localhost:8080/signup', {
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
            throw new Error((await response.json()).message || 'Signup failed');
        }
        const data = await response.json();
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
    return /^[a-zA-Z0-9_]{3,20}$/.test(username.value);
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
    <div>
        <h1>Signup Page</h1>
        <div>
            <div>
                <label>Username</label>
                <input type="text" v-model="username" />
                <div v-if="username && !checkUnameValidity()" style="color: red;">
                    Username must be 3-20 characters long and can only contain letters, numbers, and underscores.
                </div>
            </div>
            <div>
                <label>Password</label>
                <input type="text" v-model="password" />
                <div v-if="password && !checkPwdValidity()" style="color: red;">
                    Password must be at least 6 characters long.
                </div>
            </div>
            <div>
                <button type="button" @click="signup">Sign Up Here</button>
            </div>
        </div>
    </div>
</template>