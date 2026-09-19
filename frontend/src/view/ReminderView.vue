<script setup>
import { ref } from 'vue'

const enabled = ref(true)
const time = ref('08:00')
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><h1>Rappel de prise</h1><p>Configurez un rappel après votre achat.</p></div><section class="surface reminder-card"><label class="toggle-row"><span><strong>Activer les rappels</strong><small>Recevoir une notification à l'heure choisie</small></span><input v-model="enabled" type="checkbox" /></label><label class="time-row" :class="{ 'time-row--disabled': !enabled }">Heure de rappel<input v-model="time" type="time" :disabled="!enabled" /></label><button class="primary-action" type="button">Enregistrer</button></section></div></main>
</template>

<style scoped>
.reminder-card { display: grid; gap: 24px; padding: 20px; }.toggle-row, .time-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; font-size: 13px; font-weight: 800; }.toggle-row span { display: grid; gap: 5px; }.toggle-row small { color: var(--color-text-muted); font-size: 11px; font-weight: 500; }.toggle-row input { width: 42px; height: 22px; accent-color: var(--color-primary); }.time-row { padding-top: 16px; border-top: 1px solid var(--color-border); }.time-row input { padding: 9px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg); color: var(--color-text); }.time-row--disabled { opacity: .5; }.primary-action { padding: 13px; border: 0; border-radius: var(--radius-sm); background: var(--color-primary); color: white; font-weight: 800; cursor: pointer; }
</style>
