<template>
  <header>
    <nav>
      <div v-if="isAuthenticated">
        Welcome, {{ user && user.first_name ? user.first_name : 'User' }}
        <button @click="logout">Logout</button>
      </div>
      <div v-else>
        <form @submit.prevent="login">
          <div>
            <label for="email">Email:</label>
            <input v-model="email" type="email" id="email" required />
          </div>
          <div>
            <label for="password">Password:</label>
            <input v-model="password" type="password" id="password" required />
          </div>
          <button type="submit">Login</button>
          <p v-if="authError" class="error">{{ authError }}</p>
        </form>
      </div>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/authStore';

export default {
  data() {
    return {
      email: '',
      password: '',
      authStore: useAuthStore(),
    };
  },
  computed: {
    isAuthenticated() {
      return this.authStore.isAuthenticated;
    },
    user() {
      return this.authStore.user;
    },
    authError() {
      return this.authStore.errorMessage;
    },
  },
  methods: {
    logout() {
      this.authStore.logout();
    },
    async login() {
      await this.authStore.login({ email: this.email, password: this.password });

      if (this.authStore.token && !this.authStore.user) {
        await this.authStore.getUser();
      }
    },
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authStore.isAuthenticated = true;
      this.authStore.getUser();
    }
  },
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
