<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';
const router = useRouter();
const form = reactive({ username: '', firstName: '', lastName: '', email: '', password: '' });
const message = ref(''); const error = ref(''); const submitting = ref(false);
async function submit() { error.value = ''; message.value = ''; submitting.value = true; try { await api.signup(form); message.value = 'Registration successful. You can now log in.'; } catch { error.value = 'Unable to register. Check that the API is running and try again.'; } finally { submitting.value = false; } }
</script>
<template><section class="form-page"><RouterLink class="back" to="/">← Back</RouterLink><h1>Create your account</h1><p class="muted">Join Collaborate and get started.</p><form @submit.prevent="submit"><label>Username<input v-model="form.username" required autocomplete="username" /></label><label>First name<input v-model="form.firstName" required /></label><label>Last name<input v-model="form.lastName" required /></label><label>Email<input v-model="form.email" type="email" required autocomplete="email" /></label><label>Password<input v-model="form.password" type="password" required autocomplete="new-password" /></label><p v-if="error" class="error">{{ error }}</p><p v-if="message" class="success">{{ message }}</p><button class="button" :disabled="submitting">{{ submitting ? 'Registering…' : 'Register' }}</button></form></section></template>
