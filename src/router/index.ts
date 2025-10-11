import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/',
      name: 'landing',
      component: () => import('../views/LandingView.vue'),
    },
    {
      path: '/create-poll',
      name: 'create-poll',
      component: () => import('../views/CreatePollView.vue'),
    },
    {
      path: '/poll/:id',
      name: 'poll-details',
      component: () => import('../views/PollPageView.vue'),
    }
  ],
});

router.beforeEach((to, from, next) => {
  if(!['login', 'landing', 'signup'].includes(to.name as string) && !document.cookie.split('; ').filter(str => str.startsWith('csrf_token=')).length)
    return next({ name: 'login' });
  if(to.name == 'login' && document.cookie.split('; ').filter(str => str.startsWith('csrf_token=')).length)
    return next({ name: 'home' });
  next();
});

export default router
