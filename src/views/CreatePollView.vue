<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import getCSRFToken from '../utils/fetchCSRFtoken';
import NavBar from '../components/NavBar.vue';

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
        <NavBar />
        <div class="create-poll-container">
            <div class="create-poll-box">
                <h1>Create Poll</h1>
                <div class="form-group">
                    <label>Title *</label>
                    <input type="text" v-model="title" placeholder="Enter your poll question..." />
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" v-model="description" placeholder="Add more context (optional)" />
                </div>
                <div class="options-container">
                    <div v-for="(option, index) in options" :key="index" class="option-item">
                        <span class="option-label">Option {{ index + 1 }}</span>
                        <input 
                            type="text" 
                            v-model="options[index]" 
                            :placeholder="'Enter option ' + (index + 1)" 
                        />
                        <button 
                            type="button" 
                            class="delete-option-btn" 
                            :disabled="options.length <= 2"
                            @click="options.length > 2 ? options.splice(index, 1) : null"
                        >
                            Delete
                        </button>
                    </div>
                    <div>
                        <button type="button" class="add-option-btn" @click="options.push('')">
                            ➕ Add Option
                        </button>
                    </div>
                </div>
                <div>
                    <button type="button" class="create-poll-btn" @click="createPoll">Create Poll</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.create-poll-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem;
    min-height: calc(100vh - 70px);
    display: flex;
    align-items: center;
}

.create-poll-box {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 100%;
}

.create-poll-box h1 {
    color: #667eea;
    margin-bottom: 2rem;
    text-align: center;
    font-size: 2rem;
}

.create-poll-box .form-group {
    margin-bottom: 2rem;
}

.create-poll-box .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #555;
    font-weight: 600;
    font-size: 0.95rem;
}

.create-poll-box .form-group input {
    width: 100%;
    padding: 0.875rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.create-poll-box .form-group input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.create-poll-box .form-group input::placeholder {
    color: #999;
    font-style: italic;
}

.options-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 2rem 0;
}

.option-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.option-item input {
    flex: 1;
    padding: 0.875rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.option-item input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.option-label {
    min-width: 80px;
    color: #666;
    font-weight: 600;
    font-size: 0.95rem;
}

.delete-option-btn {
    padding: 0.875rem 1.25rem;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.delete-option-btn:hover:not(:disabled) {
    background-color: #c82333;
    transform: scale(1.05);
}

.delete-option-btn:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    opacity: 0.6;
    transform: scale(1);
}

.add-option-btn {
    padding: 0.875rem;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
    margin-top: 0.5rem;
}

.add-option-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(40, 167, 69, 0.4);
}

.create-poll-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 2rem;
}

.create-poll-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}
</style>