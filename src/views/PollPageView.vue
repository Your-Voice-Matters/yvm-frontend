<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { usernameStore } from '../stores/username';
import getCSRFToken from '@/utils/fetchCSRFtoken';
import { setUsername } from '@/utils/setUser';

const route = useRoute();
const router = useRouter();
const poll = ref<any>(null);
const alreadyVoted = ref(true);
const chosenOption = ref(-1);
const description = ref('');
const unmStore = usernameStore();

async function fetchPoll() {
    try {
        poll.value = "loading";
        const response = await fetch(`http://localhost:8080/poll-details?pollid=${route.params.id}`, {
            method: 'GET',
        });
        if (!response.ok) {
            poll.value = null;
            throw new Error((await response.json()).message || 'Failed to fetch poll');
        }
        poll.value = await response.json();
    } catch (error: any) {
        console.error('Error fetching poll:', error.message);
    }
}

async function isAlreadyVoted() {
    const token = await getCSRFToken();
    if (!token) {
        throw new Error('CSRF token missing');
    }
    try {
        const response = await fetch(`http://localhost:8080/has-voted?pollid=${route.params.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRF-Token': token,
            },
        });
        if (!response.ok) {
            throw new Error((await response.json()).message || 'Failed to check vote status');
        }
        const data = await response.json();
        alreadyVoted.value = data.hasVoted;
        if (alreadyVoted.value) {
            chosenOption.value = data.chosenoption;
            description.value = data.description;
        }
    }
    catch (error: any) {
        console.error('Error checking vote status:', error.message);
    }
}

function canVote() {
    return unmStore.get() && unmStore.get().trim() !== poll.value?.created_by && !alreadyVoted.value;
}

async function castVote() {
    try {
        const token = await getCSRFToken();
        if (!token) {
            throw new Error('CSRF token missing');
        }
        const response = await fetch(`http://localhost:8080/cast-vote`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': token,
            },
            body: JSON.stringify({
                pollid: Number(route.params.id) || -1,
                chosenoption: chosenOption.value,
                description: description.value,
            }),
        });
        if (!response.ok) {
            throw new Error((await response.json()).message || 'Failed to cast vote');
        }
        router.push('/home');
        alreadyVoted.value = true;
    } catch (error: any) {
        console.error('Error casting vote:', error.message);
    }
}

onMounted(async() => {
    setUsername();
    await isAlreadyVoted();
    await fetchPoll();
});
</script>

<template>
    <div>
        <NavBar />
        <div class="poll-details-container">
            <div v-if="poll == 'loading'" class="loading-message">Loading...</div>
            <div v-else-if="poll" class="poll-details-box">
                <h2>{{ poll.title }}</h2>
                <p>{{ poll.description }}</p>
                <div v-for="(option, index) in poll.options" :key="index">
                    <div class="poll-option">
                        <input type="radio" :disabled="!canVote()" :checked="chosenOption == index" @click="chosenOption = index" />
                        {{ option }}
                    </div>
                </div>
                <div v-if="canVote()" class="vote-section">
                    <textarea name="description" v-model="description" placeholder="Share your thoughts..."></textarea>
                    <button class="submit-vote-btn" @click="castVote()">Submit</button>
                </div>
                <div v-else class="vote-section">
                    <div class="user-thought">
                        {{ description || "We might see something here when you let us know your thoughts." }}
                    </div>
                </div>
                <div class="results-section">
                    <h2>Total Votes</h2>
                </div>
            </div>
            <div v-else class="error-message-box">
                <p>Failed to load poll details.</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.poll-details-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

.poll-details-box {
    background: white;
    padding: 2.5rem;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.poll-details-box h2 {
    color: #667eea;
    font-size: 2rem;
    margin-bottom: 1rem;
}

.poll-details-box > p {
    color: #666;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
}

.loading-message,
.error-message-box {
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
    color: white;
}

.poll-option {
    background: #f8f9fa;
    padding: 1rem;
    margin-bottom: 0.75rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.2s ease;
    cursor: pointer;
}

.poll-option:hover {
    background: #e9ecef;
    transform: translateX(5px);
}

.poll-option input[type="radio"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #667eea;
}

.poll-option input[type="radio"]:disabled {
    cursor: not-allowed;
}

.vote-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #e9ecef;
}

.vote-section textarea {
    width: 100%;
    min-height: 100px;
    padding: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: all 0.3s ease;
    margin-bottom: 1rem;
}

.vote-section textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-vote-btn {
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.submit-vote-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.user-thought {
    background: #f8f9fa;
    padding: 1.5rem;
    border-radius: 10px;
    color: #666;
    line-height: 1.6;
    font-style: italic;
}

.results-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #e9ecef;
}

.results-section h2 {
    color: #667eea;
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 768px) {
    .auth-box,
    .create-poll-box {
        padding: 2rem;
    }

    .home-container,
    .create-poll-container,
    .poll-details-container {
        padding: 1rem;
    }

    .poll-card h1,
    .poll-details-box h2 {
        font-size: 1.3rem;
    }

    .option-item {
        flex-direction: column;
        align-items: stretch;
    }

    .delete-option-btn {
        width: 100%;
    }
}
</style>