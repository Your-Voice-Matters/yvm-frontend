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
    <h1>Most Popular Polls</h1>
    <h1>Polls That I Participated In</h1>
    <div v-for="(poll, index) in pollsIParticipatedIn" :key="index" style="cursor: pointer;" @click="getPollDetails(poll.pollid)">
      <h1>{{ poll.title }}</h1>
      <p>{{ poll.p_desc }}</p>
    </div>
    <h1>Polls that I Created</h1>
    <div v-for="(poll, index) in myPolls" :key="index" style="cursor: pointer;" @click="getPollDetails(poll.id)">
      <h1>{{ poll.title }}</h1>
      <p>{{ poll.description }}</p>
    </div>
  </div>
</template>

<style scoped></style>