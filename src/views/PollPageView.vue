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
        <div v-if="poll == 'loading'">Loading...</div>
        <div v-else-if="poll">
            <h2>{{ poll.title }}</h2>
            <p>{{ poll.description }}</p>
            <div v-for="(option, index) in poll.options" :key="index">
                <div>
                    <input type="radio" :disabled="!canVote()" :checked="chosenOption == index" @click="chosenOption = index" />
                    {{ option }}
                </div>
            </div>
            <div v-if="canVote()">
                <textarea name="description" v-model="description"></textarea>
                <button @click="castVote()">Submit</button>
            </div>
            <div v-else>
                {{ description || "We might see something here when you let us know your thoughts." }}
            </div>
            <div>
                <h2>Total Votes</h2>
            </div>
        </div>
        <div v-else>
            <p>Failed to load poll details.</p>
        </div>
    </div>
</template>

<style scoped></style>