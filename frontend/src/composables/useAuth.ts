import { ref } from 'vue';
import { adminLogin } from '../api/index.api';
import type { AuthDTO } from '../types/dto';

const token = ref<string | null>(localStorage.getItem('admin_token'));
const user = ref<AuthDTO['user'] | null>(null);

export function useAuth() {
  const isLoggedIn = ref(!!token.value);

  async function login(email: string, password: string) {
    const res = await adminLogin(email, password);
    const dto = res.data.data!;
    token.value = dto.token;
    user.value = dto.user;
    localStorage.setItem('admin_token', dto.token);
    isLoggedIn.value = true;
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('admin_token');
    isLoggedIn.value = false;
  }

  return { token, user, isLoggedIn, login, logout };
}