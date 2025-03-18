import "primeicons/primeicons.css";
import "./assets/style.css";

import { createApp } from "vue";
import { createPinia } from 'pinia';
import PrimeVue from "primevue/config";
import ConfirmationService from 'primevue/confirmationservice'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice';

import App from "./App.vue";
import AppState from './plugins/appState.js';
import ThemeSwitcher from './components/ThemeSwitcher.vue';
import Noir from '@/presets/Noir';
import router from './router';


const app = createApp(App);

app.use(PrimeVue, {
  locale: {
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  },
  theme: {
    preset: Noir,
    options: {
      prefix: 'p',
      darkModeSelector: '.p-dark',
      cssLayer: false,
    }
  }
});
app.use(AppState);
app.use(createPinia())
app.use(router)
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);

app.component('ThemeSwitcher', ThemeSwitcher);

app.mount("#app");
