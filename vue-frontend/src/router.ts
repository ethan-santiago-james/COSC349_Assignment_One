import { createRouter, createWebHistory } from 'vue-router';
import { isLoggedIn } from './services/session';
import ChatView from './views/ChatView.vue';
import ChatsView from './views/ChatsView.vue';
import DashboardView from './views/DashboardView.vue';
import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import SignupView from './views/SignupView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomeView },
    { path: '/sign-up', component: SignupView },
    { path: '/log-in', component: LoginView },
    { path: '/dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/chats', component: ChatsView, meta: { requiresAuth: true } },
    { path: '/chat/:username', component: ChatView, meta: { requiresAuth: true }, props: true },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) return '/log-in';
  return true;
});

export default router;
