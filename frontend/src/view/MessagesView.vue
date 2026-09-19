<script setup>
import BottomNav from '../components/common/BottomNav.vue'

const messages = [
  { title: 'Pharmacie du Centre', text: 'Votre réservation est confirmée.', time: 'Il y a 10 min', unread: true },
  { title: 'Bikis', text: 'Votre ordonnance a bien été enregistrée.', time: 'Hier', unread: false },
]
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><h1>Messages</h1><p>Vos notifications et échanges importants.</p></div><section class="surface message-list"><button v-for="message in messages" :key="message.title" class="message" :class="{ 'message--unread': message.unread }" type="button"><span class="message__avatar">{{ message.title.charAt(0) }}</span><span class="message__body"><strong>{{ message.title }}</strong><span>{{ message.text }}</span></span><time>{{ message.time }}</time></button></section></div><BottomNav /></main>
</template>

<style scoped>
.message-list { overflow: hidden; }.message { display: flex; width: 100%; align-items: center; gap: 12px; padding: 16px; border: 0; border-bottom: 1px solid var(--color-border); background: transparent; color: var(--color-text); text-align: left; cursor: pointer; }.message:last-child { border-bottom: 0; }.message--unread { background: color-mix(in srgb, var(--color-primary-light) 45%, transparent); }.message__avatar { display: grid; flex: 0 0 38px; height: 38px; place-items: center; border-radius: 50%; background: var(--color-primary); color: white; font-weight: 800; }.message__body { display: grid; flex: 1; gap: 4px; min-width: 0; }.message__body span { overflow: hidden; color: var(--color-text-muted); font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }.message time { color: var(--color-text-muted); font-size: 10px; white-space: nowrap; }
</style>
