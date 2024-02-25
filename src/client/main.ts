import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import './assets/styles.css';
import { HttpClient } from './lib/HttpClient';

createApp(App).use(router).mount('#app');

HttpClient.setup();
