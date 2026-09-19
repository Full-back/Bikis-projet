<script setup>
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <header class="app-header">
    <div><p>Bonjour 👋</p><strong>Emma</strong></div>
    <div class="app-header__actions"><ThemeToggle /><RouterLink class="avatar" to="/profile" aria-label="Ouvrir mon profil">E</RouterLink></div>
  </header>
</template>

<style scoped>
.app-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.app-header p { margin: 0 0 3px; color: var(--color-primary); font-size: 12px; font-weight: 700; }
.app-header strong { font-size: 23px; }
.app-header__actions { display: flex; align-items: center; gap: 9px; }
.avatar { display: grid; place-items: center; width: 36px; height: 36px; border: 2px solid #61b28a; border-radius: 50%; background: #d29a64; color: white; font-weight: 800; text-decoration: none; }
</style>