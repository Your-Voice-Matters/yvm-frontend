<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

import NavBar from "../components/NavBar.vue";
import getCSRFToken from '../utils/fetchCSRFtoken';
import { setUsername } from '@/utils/setUser';

const myPolls = ref<any[]>([]);
const pollsIParticipatedIn = ref<any[]>([]);

async function fetchMyPolls() {
  try {
    const csrfToken = await getCSRFToken();
    if (!csrfToken) {
      throw new Error('CSRF token missing');
    }

    const response = await fetch('http://localhost:8080/my-polls', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch my polls');
    }

    const data = await response.json();
    myPolls.value = data;
  } catch (err: any) {
    console.log(err.message || 'An error occurred');
  }
}

async function fetchPollsIParticipatedIn() {
  try {
    const csrfToken = await getCSRFToken();
    if (!csrfToken) {
      throw new Error('CSRF token missing');
    }

    const response = await fetch('http://localhost:8080/polls-i-participated-in', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': csrfToken,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch polls I participated in');
    }

    const data = await response.json();
    pollsIParticipatedIn.value = data;
  } catch (err: any) {
    console.log(err.message || 'An error occurred');
  }
}

function getPollDetails(pollId: number) {
  router.push(`/poll/${pollId}`);
}

onMounted(() => {
  setUsername();
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
        
        <h1>Polls That I Participated In</h1>
        <div v-for="(poll, index) in pollsIParticipatedIn" :key="index" class="poll-card" @click="getPollDetails(poll.pollid)">
          <h1>{{ poll.title }}</h1>
          <p>{{ poll.p_desc }}</p>
        </div>
        
        <h1>Polls that I Created</h1>
        <div v-for="(poll, index) in myPolls" :key="index" class="poll-card" @click="getPollDetails(poll.id)">
          <h1>{{ poll.title }}</h1>
          <p>{{ poll.description }}</p>
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

.poll-card {
    background: white;
    padding: 1.5rem;
    margin-bottom: 1rem;
    border-radius: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.poll-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.poll-card h1 {
    color: #667eea;
    font-size: 1.4rem;
    margin: 0 0 0.5rem 0;
    text-shadow: none;
}

.poll-card p {
    color: #666;
    margin: 0;
    line-height: 1.6;
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