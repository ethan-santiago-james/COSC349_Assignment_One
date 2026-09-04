<!--
Initial implementation generated with OpenAI Codex.
Reviewed and modified by Ethan James, including changes to
message styling and sender identification.
-->
<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api'; import { setUsername } from '../services/session';
const router = useRouter(); const form = reactive({ username: '', password: '' }); const error = ref(''); const submitting = ref(false);
async function submit() { if (!form.username.trim() || !form.password) { error.value = 'Enter your username and password to continue.'; return; } error.value = ''; submitting.value = true; try { await api.login(form.username.trim(), form.password); setUsername(form.username.trim()); router.replace('/dashboard'); } catch { error.value = 'Unable to log in. Check your credentials and try again.'; } finally { submitting.value = false; } }
</script>
<template><section class="form-page"><RouterLink class="back" to="/">← Back</RouterLink><h1>Log in</h1><p class="muted">Welcome back to Collaborate.</p><form @submit.prevent="submit"><label>Username<input v-model="form.username" required autocomplete="username" /></label><label>Password<input v-model="form.password" type="password" required autocomplete="current-password" /></label><p v-if="error" class="error">{{ error }}</p><button class="button" :disabled="submitting">{{ submitting ? 'Logging in…' : 'Log in' }}</button></form></section></template>
