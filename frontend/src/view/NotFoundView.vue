<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="not-found"><div><strong>404</strong><h1>Page introuvable</h1><p>Cette page n'existe pas ou n'est plus disponible.</p><button type="button" @click="router.push({ name: 'home' })">Retour à l'accueil</button></div></main>
</template>

<style scoped>
.not-found { display: grid; min-height: 100svh; place-items: center; padding: 24px; background: var(--color-bg); text-align: center; }.not-found div { width: min(100%, 420px); }.not-found strong { color: var(--color-accent); font-size: 72px; line-height: 1; }.not-found h1 { margin: 12px 0 8px; }.not-found p { margin: 0 0 24px; color: var(--color-text-muted); }.not-found button { padding: 13px 18px; border: 0; border-radius: var(--radius-sm); background: var(--color-primary); color: white; font-weight: 800; cursor: pointer; }
</style>
