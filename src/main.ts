import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { piniaPlugin } from '@/utils/piniaLatest';

import './assets/main.css';

const store = createPinia();
store.use(
  piniaPlugin({
    key: 'pinia'
}));

const app = createApp(App);

app.use(store);
app.use(router);

app.mount('#app');
