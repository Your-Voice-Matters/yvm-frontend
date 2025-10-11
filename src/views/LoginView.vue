<script setup lang="ts">
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';

    import { usernameStore } from '../stores/username';

    const router = useRouter();
    const unmStore = usernameStore();
    const username = ref('');
    const password = ref('');

    const handleLogin = async() => {
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username.value,
                    password: password.value,
                }),
            });
            if(!response.ok) {
                throw new Error((await response.json()).message || 'Login failed');
            }
            const data = await response.json();
            window.localStorage.setItem('username', username.value);
            unmStore.set(username.value);
            console.log('Login successful:');
            router.push('/home');
        } catch (error: any) {
            console.error('Error during login:', error.message);
        }
    };
</script>

<template>
    <div>Login</div>
    <div>
        <div>
            <label>Username</label>
            <input type="text" v-model="username" />
        </div>
        <div>
            <label>Password</label>
            <input type="text" v-model="password" />
        </div>
        <div>
            <button type="button" @click="handleLogin">Login Here</button>
        </div>
    </div>
</template>

<style scoped></style>