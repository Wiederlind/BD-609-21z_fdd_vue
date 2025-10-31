import { defineStore } from 'pinia';
import axios from 'axios';

// Хранилище аутентификации пользователя
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null, // Данные пользователя
        token: localStorage.getItem('token') || null, // Токен из localStorage
        isAuthenticated: false, // Статус аутентификации
        errorMessage: '',
    }),
    actions: {
        async login(credentials) {
            this.errorMessage = '';
            try {
                const response = await axios.post(
                    'http://127.0.0.1:8000/api/login',
                    credentials,
                );
                this.token = response.data.token;
                this.user = response.data.user;
                this.isAuthenticated = true;
                localStorage.setItem('token', response.data.token);
            } catch (error) {
                if (error.response) {
                    // Сервер вернул ответ со статусом вне диапазона 2xx
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                } else if (error.request) {
                    // Запрос был сделан, но ответа не получено
                    // `error.request` — это экземпляр XMLHttpRequest в браузере
                    this.errorMessage = error.message;
                    console.log(error);
                } else {
                    // Произошла ошибка при настройке запроса
                    console.log(error);
                }
            }
        },

        async getUser() {
            this.errorMessage = '';
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/user', {
                    headers: {
                        Authorization: 'Bearer ' + this.token,
                    },
                });
                this.user = response.data;
            } catch (error) {
                if (error.response) {
                    // Сервер вернул ответ со статусом вне диапазона 2xx
                    this.errorMessage = error.response.data.message;
                    console.log(error);
                } else if (error.request) {
                    // Запрос был сделан, но ответа не получено
                    this.errorMessage = error.message;
                    console.log(error);
                } else {
                    // Произошла ошибка при настройке запроса
                    console.log(error);
                }
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            this.isAuthenticated = false;
            // Удаляем токен из localStorage
            localStorage.removeItem('token');
        },
    },
});

