import { createRouter, createWebHistory } from 'vue-router';
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Test from './components/Test.vue';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/test',
    name: 'Test',
    component: Test,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
