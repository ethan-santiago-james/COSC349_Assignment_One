<!--
Initial implementation generated with OpenAI Codex.
Reviewed and modified by Ethan James, including changes to
message styling and sender identification.
-->

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'; import { useRoute } from 'vue-router'; import { api, type Message } from '../services/api'; import { getUsername } from '../services/session';
const route = useRoute(); const otherUser = String(route.params.username); const messages = ref<Message[]>([]); const message = ref(''); const loading = ref(true); const error = ref(''); let timer: number | undefined;
async function load() { try { messages.value = await api.messages(getUsername(), otherUser); } catch { error.value = 'Could not load messages.'; } finally { loading.value = false; } }
async function send() { const content = message.value.trim(); if (!content) return; try { const posted = await api.sendMessage(getUsername(), otherUser, content); messages.value = [...messages.value, posted]; message.value = ''; } catch { error.value = 'Could not send your message.'; } }
onMounted(() => { load(); timer = window.setInterval(load, 3000); }); onBeforeUnmount(() => { if (timer) window.clearInterval(timer); });
</script>
<template><section class="chat-page"><header class="chat-header"><RouterLink class="back" to="/chats">←</RouterLink><div class="avatar">{{ otherUser.slice(0, 2).toUpperCase() }}</div><div class="grow"><strong>@{{ otherUser }}</strong><p class="muted">Online</p></div></header><p v-if="error" class="error chat-error">{{ error }}</p><div class="messages"><p v-if="loading" class="muted">Loading messages…</p><p v-else-if="!messages.length" class="muted">No messages yet. Start the conversation!</p><div v-for="(item, index) in messages" :key="item.id ?? index" class="message-row" :class="{ mine: item.from_user === getUsername() }"><p class="bubble">{{ item.content }}</p></div></div><form class="composer" @submit.prevent="send"><textarea v-model="message" aria-label="Message" placeholder="Message…" maxlength="1000" rows="1" /><button class="send" :disabled="!message.trim()">↑</button></form></section></template>
