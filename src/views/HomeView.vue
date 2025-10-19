<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

import NavBar from "../components/NavBar.vue";
import { setUsername } from '@/utils/setUser';
import { BASE_URL } from '@/utils/constants';
import { showToast } from '@/utils/toastsService';
import { checkUserToken } from "../utils/checkUserToken";

const mostPopularPolls = ref<any[]>([]);
const myPolls = ref<any[]>([]);
const pollsIParticipatedIn = ref<any[]>([]);

async function getMostPopularPolls() {
  try {
    const response = await fetch(`${BASE_URL}/most-popular-polls`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.message || 'Failed to fetch popular polls';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }

    mostPopularPolls.value = await response.json();
  } catch (err: any) {
    console.log(err.message || 'An error occurred');
    mostPopularPolls.value = [];
  }
}

async function fetchMyPolls() {
  try {
    const response = await fetch(`${BASE_URL}/my-polls`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.message || 'Failed to fetch my polls';
      showToast(errorMsg, 'error');
      throw new Error(errorMsg);
    }

    const data = await response.json();
    myPolls.value = data;
  } catch (err: any) {
    console.log(err.message || 'An error occurred');
    myPolls.value = [];
  }
}

async function fetchPollsIParticipatedIn() {
  try {
    const response = await fetch(`${BASE_URL}/polls-i-participated-in`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${window.localStorage.getItem('token') || ''}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMsg = errorData.message || 'Failed to fetch participated polls';
      showToast(errorMsg, 'error');
      throw new Error();
    }

    const data = await response.json();
    pollsIParticipatedIn.value = data;
  } catch (err: any) {
    console.log(err.message || 'An error occurred');
    pollsIParticipatedIn.value = [];
  }
}

function getPollDetails(pollId: number) {
  router.push(`/poll/${pollId}`);
}

onBeforeMount(async() => {
  await checkUserToken();
});

onMounted(() => {
  setUsername();
  getMostPopularPolls();
  fetchMyPolls();
  fetchPollsIParticipatedIn();
});
</script>

<template>
  <div>
    <NavBar />
    <div class="home-container">
        <div class="home-header">
            <h1 class="home-welcome">Welcome Back!</h1>
            <button class="create-poll-link" @click="router.push('/create-poll')">
                <span>➕</span>
                Create New Poll
            </button>
        </div>
       
        <h1>Most Popular Polls</h1>
        <div class="polls-grid" v-if="mostPopularPolls && mostPopularPolls.length > 0">
            <div v-for="(poll, index) in mostPopularPolls" :key="index" class="poll-card" @click="getPollDetails(poll.id)">
                <h1>{{ poll.title }}</h1>
                <p>{{ poll.description }}</p>
                <div class="poll-card-footer">
                    <div class="poll-votes">
                        <span class="poll-votes-icon">🗳️</span>
                        <span class="poll-votes-count">{{ poll.votes_count || 0 }}</span>
                        <span>{{ poll.votes_count === 1 ? 'vote' : 'votes' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="empty-polls-message">
            Unfortunately, there are no polls which have votes yet. Be the first to create or participate in a poll!
        </div>
       
        <h1>Polls That I Participated In</h1>
        <div class="polls-grid" v-if="pollsIParticipatedIn && pollsIParticipatedIn.length > 0">
            <div v-for="(poll, index) in pollsIParticipatedIn" :key="index" class="poll-card" @click="getPollDetails(poll.pollid)">
                <h1>{{ poll.title }}</h1>
                <p>{{ poll.p_desc }}</p>
                <div class="poll-card-footer">
                    <div class="poll-votes">
                        <span class="poll-votes-icon">🗳️</span>
                        <span class="poll-votes-count">{{ poll.votes_count || 0 }}</span>
                        <span>{{ poll.votes_count === 1 ? 'vote' : 'votes' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="empty-polls-message">
            You haven't participated in any polls yet. Explore and vote!
        </div>
       
        <h1>Polls that I Created</h1>
        <div class="polls-grid" v-if="myPolls && myPolls.length > 0">
            <div v-for="(poll, index) in myPolls" :key="index" class="poll-card" @click="getPollDetails(poll.id)">
                <h1>{{ poll.title }}</h1>
                <p>{{ poll.description }}</p>
                <div class="poll-card-footer">
                    <div class="poll-votes">
                        <span class="poll-votes-icon">🗳️</span>
                        <span class="poll-votes-count">{{ poll.votes_count || 0 }}</span>
                        <span>{{ poll.votes_count === 1 ? 'vote' : 'votes' }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="empty-polls-message">
            You haven't created any polls yet. Start by creating one!
        </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.home-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.home-welcome {
    color: white;
    font-size: 2rem;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.create-poll-link {
    padding: 0.875rem 2rem;
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
}

.create-poll-link:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(40, 167, 69, 0.4);
}

.create-poll-link:active {
    transform: translateY(0);
}

.home-container h1 {
    color: white;
    margin: 2.5rem 0 1.5rem 0;
    font-size: 1.8rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.home-container h1:first-of-type {
    margin-top: 1rem;
}

.polls-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.poll-card {
    background: white;
    padding: 1.75rem;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 160px;
}

.poll-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
}

.poll-card:hover::before {
    transform: scaleX(1);
}

.poll-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.2);
}

.poll-card h1 {
    color: #667eea;
    font-size: 1.25rem;
    margin: 0 0 0.75rem 0;
    text-shadow: none;
    font-weight: 700;
    line-height: 1.3;
    display: -webkit-box;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.poll-card p {
    color: #666;
    margin: 0;
    line-height: 1.6;
    font-size: 0.95rem;
    display: -webkit-box;
    line-clamp: 3;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
}

.poll-card-footer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #f0f0f0;
}

.poll-votes {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #667eea;
    font-size: 0.9rem;
    font-weight: 600;
}

.poll-votes-icon {
    font-size: 1rem;
}

.poll-votes-count {
    font-weight: 700;
}

.empty-polls-message {
    background: rgba(255, 255, 255, 0.9);
    padding: 2.5rem;
    border-radius: 15px;
    text-align: center;
    color: #666;
    font-style: italic;
    font-size: 1rem;
}

@media (max-width: 768px) {
    .polls-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
}

.empty-state {
    background: rgba(255, 255, 255, 0.9);
    padding: 2rem;
    border-radius: 15px;
    text-align: center;
    color: #666;
    font-style: italic;
}
</style>