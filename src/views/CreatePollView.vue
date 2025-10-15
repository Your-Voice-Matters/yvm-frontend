<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import NavBar from '../components/NavBar.vue';
import { BASE_URL } from '@/utils/constants';
import { showToast } from '@/utils/toastsService';

const router = useRouter();
const title = ref('');
const description = ref('');
const options = ref<string[]>(['', '']);
const isCreating = ref(false);
const showModal = ref(false);

const showConfirmation = () => {
    if(!title.value.trim()) {
        showToast('Title is required', 'error');
        throw new Error('Title is required');
    }
    if(options.value.filter(opt => !opt.trim()).length) {
        showToast('All options must be non-empty', 'error');
        throw new Error('All options must be non-empty');
    }
    isCreating.value = true;
    showModal.value = true;
};

const cancelCreation = () => {
    showModal.value = false;
    isCreating.value = false;
};

const confirmCreation = () => {
    showModal.value = false;
    createPoll();
    isCreating.value = false;
};

const createPoll = async() => {
    try {
        const response = await fetch(`${BASE_URL}/create-poll`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('token') || ''}`,
            },
            body: JSON.stringify({
                title: title.value,
                description: description.value,
                options: options.value,
            }),
        });
        if(!response.ok) {
            const errorMsg = (await response.json()).message || 'Poll creation failed';
            showToast(errorMsg, 'error');
            throw new Error(errorMsg);
        }
        const data = await response.json();
        showToast('Poll created successfully!', 'success');
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
                    <button 
                        type="button" 
                        class="create-poll-btn" 
                        :disabled="isCreating"
                        @click="showConfirmation"
                    >
                        {{ isCreating ? 'Creating...' : 'Create Poll' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Confirmation Modal -->
        <div v-if="showModal" class="modal-overlay" @click.self="cancelCreation">
            <div class="modal-content">
                <div class="modal-icon">⚠️</div>
                <h2 class="modal-title">Confirm Poll Creation</h2>
                <p class="modal-message">
                    Are you sure you want to create this poll?
                </p>
                <div class="modal-warning">
                    <strong>⚠️ Important:</strong> Once created, polls cannot be edited or deleted. Please review your poll carefully before confirming.
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn modal-btn-cancel" @click="cancelCreation">
                        Cancel
                    </button>
                    <button class="modal-btn modal-btn-confirm" @click="confirmCreation">
                        Yes, Create Poll
                    </button>
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

.create-poll-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: translateY(0);
    box-shadow: none;
}

/* ===== CONFIRMATION MODAL ===== */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-icon {
    font-size: 3.5rem;
    text-align: center;
    margin-bottom: 1rem;
}

.modal-title {
    font-size: 1.8rem;
    color: #333;
    text-align: center;
    margin-bottom: 1rem;
    font-weight: 700;
}

.modal-message {
    font-size: 1rem;
    color: #666;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 2rem;
}

.modal-warning {
    background: #fff3cd;
    border-left: 4px solid #ffc107;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    color: #856404;
    font-size: 0.95rem;
}

.modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
}

.modal-btn {
    padding: 0.875rem 2rem;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.modal-btn-cancel {
    background: #6c757d;
    color: white;
}

.modal-btn-cancel:hover {
    background: #5a6268;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 117, 125, 0.3);
}

.modal-btn-confirm {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.modal-btn-confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
</style>