<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import getCSRFToken from '../utils/fetchCSRFtoken';

const router = useRouter();
const title = ref('');
const description = ref('');
const options = ref<string[]>(['', '']);

const createPoll = async() => {
    try {
        if(!title.value.trim()) {
            throw new Error('Title is required');
        }
        if(options.value.filter(opt => !opt.trim()).length) {
            throw new Error('All options must be non-empty');
        }
        const csrfToken = await getCSRFToken();
        if (!csrfToken) {
            throw new Error('CSRF token missing');
        }
        const response = await fetch('http://localhost:8080/create-poll', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': csrfToken,
            },
            body: JSON.stringify({
                title: title.value,
                description: description.value,
                options: options.value,
            }),
        });
        if(!response.ok) {
            throw new Error((await response.json()).message || 'Poll creation failed');
        }
        const data = await response.json();
        console.log('Poll created successfully:', data);
        router.push('/home');
    } catch (error: any) {
        console.error('Error during poll creation:', error.message);
    }
};
</script>

<template>
    <div>
        <h1>Create Poll</h1>
        <div>
            <div>
                <label>Title *</label>
                <input type="text" v-model="title" />
            </div>
            <div>
                <label>Description</label>
                <input type="text" v-model="description" />
            </div>
            <div class="options-container">
                <div v-for="(option, index) in options" :key="index">
                    <input type="text" v-model="options[index]" />
                    <button type="button" @click="options.length>2 ? options.splice(index, 1) : null">Delete option</button>
                </div>
                <div>
                    <button type="button" @click="options.push('')">Add Option</button>
                </div>
            </div>
            <div>
                <button type="button" @click="createPoll">Create Poll</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.options-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
    .option {
        display: flex;
        align-items: center;
        gap: 10px;
        input {
            flex: 1;
            display: block;
        }
        button {
            padding: 5px 10px;
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    }
}
</style>