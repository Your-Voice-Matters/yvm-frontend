<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { usernameStore } from '../stores/username';
import getCSRFToken from '@/utils/fetchCSRFtoken';
import { setUsername } from '@/utils/setUser';
import { BASE_URL } from '@/utils/constants';
import { showToast } from '@/utils/toastsService';

const route = useRoute();
const router = useRouter();
const poll = ref<any>(null);
const option_votes = ref<any[]>([]);
const alreadyVoted = ref(true);
const chosenOption = ref(-1);
const description = ref('');
const unmStore = usernameStore();

async function fetchPoll() {
    try {
        poll.value = "loading";
        const response = await fetch(`${BASE_URL}/poll-details?pollid=${route.params.id}`, {
            method: 'GET',
        });
        if (!response.ok) {
            poll.value = null;
            option_votes.value = [];
            const errorMsg = (await response.json()).message || 'Failed to fetch poll details';
            console.error(errorMsg);
            throw new Error(errorMsg);
        }
        const data = await response.json();
        poll.value = data.poll;
        option_votes.value = data.option_votes;
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
        const response = await fetch(`${BASE_URL}/has-voted?pollid=${route.params.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'X-CSRF-Token': token,
            },
        });
        if (!response.ok) {
            const errorMsg = (await response.json()).message || 'Failed to check vote status';
            console.error(errorMsg);
            throw new Error(errorMsg);
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
        const response = await fetch(`${BASE_URL}/cast-vote`, {
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
            const errorMsg = (await response.json()).message || 'Failed to cast vote';
            showToast(errorMsg, 'error');
            throw new Error(errorMsg);
        }
        showToast('Vote casted successfully!', 'success');
        alreadyVoted.value = true;
        router.push('/home');
    } catch (error: any) {
        console.error('Error casting vote:', error.message);
    }
}

const getTotalVotes = () => {
    if (!option_votes.value || !option_votes.value.length) return 0;
    return option_votes.value.reduce((sum: number, item: any) => sum + item.votes_count, 0);
};

const getPercentage = (votes: number) => {
    const total = getTotalVotes();
    if (total === 0) return 0;
    return Math.round((votes / total) * 100);
};

const getSortedResults = () => {
    if (!option_votes.value || !option_votes.value.length) return [];
    return [...option_votes.value].sort((a, b) => b.votes_count - a.votes_count);
};

const getRankClass = (index: number) => {
    return `rank-${index + 1}`;
};

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
                    <h2>Poll Results</h2>
                    
                    <div class="results-stats">
                        <div class="stat-item-result">
                            <span class="stat-number-result">{{ getTotalVotes() }}</span>
                            <span class="stat-label-result">Total Votes</span>
                        </div>
                        <div class="stat-item-result">
                            <span class="stat-number-result">{{ poll.options.length }}</span>
                            <span class="stat-label-result">Options</span>
                        </div>
                    </div>

                    <div v-if="getTotalVotes() > 0" class="results-chart">
                        <div v-for="(item, index) in getSortedResults()" :key="index" class="chart-bar-container">
                            <div class="chart-bar-header">
                                <span class="chart-option-label">{{ poll.options[item.chosenoption] }}</span>
                                <div class="chart-option-stats">
                                    <span class="chart-votes-count">{{ item.votes_count }} votes</span>
                                    <span class="chart-percentage">{{ getPercentage(item.votes_count) }}%</span>
                                </div>
                            </div>
                            <div class="chart-bar-wrapper">
                                <div 
                                    class="chart-bar-fill" 
                                    :style="{ width: getPercentage(item.votes_count) + '%' }"
                                >
                                    <span v-if="getPercentage(item.votes_count) > 15" class="chart-bar-percentage-inside">
                                        {{ getPercentage(item.votes_count) }}%
                                    </span>
                                </div>
                                <div :class="['chart-bar-rank', getRankClass(index)]">
                                    {{ index + 1 }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="no-votes-message">
                        No votes yet. Be the first to vote!
                    </div>
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
    margin-bottom: 1.5rem;
}

.results-stats {
    display: flex;
    justify-content: space-around;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 15px;
}

.stat-item-result {
    text-align: center;
}

.stat-number-result {
    font-size: 2rem;
    font-weight: bold;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: block;
    margin-bottom: 0.25rem;
}

.stat-label-result {
    color: #666;
    font-size: 0.9rem;
}

.results-chart {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
}

.chart-bar-container {
    position: relative;
}

.chart-bar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.chart-option-label {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
}

.chart-option-stats {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.9rem;
}

.chart-votes-count {
    color: #667eea;
    font-weight: 700;
}

.chart-percentage {
    color: #666;
    font-weight: 600;
}

.chart-bar-wrapper {
    position: relative;
    height: 45px;
    background: #f0f0f0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
}

.chart-bar-fill {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 1rem;
    position: relative;
    overflow: hidden;
}

.chart-bar-fill::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
}

@keyframes shimmer {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(100%);
    }
}

.chart-bar-percentage-inside {
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
    z-index: 1;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.chart-bar-rank {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.85rem;
    color: #667eea;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    z-index: 2;
}

.chart-bar-rank.rank-1 {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    color: #333;
}

.chart-bar-rank.rank-2 {
    background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
    color: #333;
}

.chart-bar-rank.rank-3 {
    background: linear-gradient(135deg, #cd7f32 0%, #e6a96d 100%);
    color: #333;
}

.no-votes-message {
    text-align: center;
    padding: 2rem;
    color: #999;
    font-style: italic;
    background: #f8f9fa;
    border-radius: 12px;
}

@media (max-width: 768px) {
    .results-stats {
        flex-direction: column;
        gap: 1rem;
    }
    
    .chart-bar-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .chart-bar-wrapper {
        height: 40px;
    }
    
    .chart-bar-rank {
        width: 24px;
        height: 24px;
        font-size: 0.75rem;
        left: 0.75rem;
    }
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