<template>
  <div class="login-page">
    <h1>管理員登入</h1>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="密碼" required />
      <button type="submit">登入</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { login } = useAuth();
const email = ref('');
const password = ref('');
const error = ref('');

async function handleLogin() {
  try {
    await login(email.value, password.value);
    router.push('/admin/dashboard');
  } catch (e: any) {
    error.value = e.response?.data?.error || '登入失敗';
  }
}
</script>

<style scoped>
.login-page { max-width: 400px; margin: 60px auto; }
input { display: block; width: 100%; margin-bottom: 12px; padding: 10px; }
.error { color: #f44; }
</style>