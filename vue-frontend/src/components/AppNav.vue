<script setup lang="ts">
import { useRouter } from 'vue-router';
import { clearSession } from '../services/session';

const router = useRouter();
function logout() { clearSession(); router.push('/'); }
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink to="/dashboard">Peoples</RouterLink>
    <RouterLink to="/chats">Chats</RouterLink>
    <button class="link-button" @click="logout">Log out</button>
  </nav>
</template>
