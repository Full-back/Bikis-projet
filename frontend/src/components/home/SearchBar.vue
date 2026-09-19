<script setup>
const model = defineModel({ default: '' })
</script>

<template>
  <form class="search-bar" @submit.prevent><span aria-hidden="true">⌕</span><input v-model="model" type="search" placeholder="Rechercher un médicament, une pharmacie..." aria-label="Rechercher" /><button v-if="model" type="button" aria-label="Effacer" @click="model = ''">×</button></form>
</template>

<style scoped>
.search-bar { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border: 1px solid var(--color-border); border-radius: 9px; background: var(--color-surface); }.search-bar span { color: var(--color-text-muted); font-size: 20px; }.search-bar input { width: 100%; border: 0; outline: 0; background: transparent; color: var(--color-text); font-size: 13px; }.search-bar button { border: 0; background: none; color: var(--color-text-muted); cursor: pointer; }
</style>