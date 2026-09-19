<script setup>
import BottomNav from '../components/common/BottomNav.vue'
import { useAuthStore } from '../stores/authStore'
const auth = useAuthStore()
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><h1>Mon profil</h1><p>Gérez vos informations personnelles.</p></div><section class="surface profile-card"><div class="profile-avatar">E</div><strong>{{ auth.user.firstName }}</strong><span>{{ auth.user.city }}</span></section><section class="surface settings"><button type="button">Mes informations <b>›</b></button><button type="button">Notifications <b>›</b></button><button type="button">Aide et assistance <b>›</b></button></section></div><BottomNav /></main>
</template>

<style scoped>
.profile-card { display: grid; justify-items: center; gap: 5px; padding: 25px; margin-bottom: 14px; }.profile-avatar { display: grid; place-items: center; width: 64px; height: 64px; margin-bottom: 5px; border-radius: 50%; background: #d29a64; color: white; font-size: 24px; font-weight: 800; }.profile-card strong { font-size: 18px; }.profile-card span { color: var(--color-text-muted); font-size: 12px; }.settings { overflow: hidden; }.settings button { display: flex; justify-content: space-between; width: 100%; padding: 16px; border: 0; border-bottom: 1px solid var(--color-border); background: transparent; color: var(--color-text); text-align: left; font-size: 12px; cursor: pointer; }.settings button:last-child { border-bottom: 0; }.settings b { color: var(--color-text-muted); font-size: 18px; }
</style>