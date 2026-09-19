<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const confirmed = ref(false)
const pharmacy = route.query.pharmacy || 'Pharmacie du Centre'

function confirmReservation() {
  confirmed.value = true
}
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><h1>{{ confirmed ? 'Réservation envoyée' : 'Confirmer la réservation' }}</h1><p>{{ confirmed ? 'La pharmacie vous tiendra informé de la disponibilité.' : 'Vérifiez les informations avant de continuer.' }}</p></div><section class="surface summary"><div><span>Pharmacie</span><strong>{{ pharmacy }}</strong></div><div><span>Médicament</span><strong>Amoxicilline 500 mg</strong></div><div><span>Quantité</span><strong>1 boîte</strong></div></section><button v-if="!confirmed" class="primary-action" type="button" @click="confirmReservation">Envoyer la réservation</button><button v-else class="secondary-action" type="button" @click="router.push({ name: 'tracking' })">Voir le suivi</button></div></main>
</template>

<style scoped>
.summary { display: grid; gap: 16px; padding: 20px; }.summary div { display: grid; gap: 5px; }.summary span { color: var(--color-text-muted); font-size: 12px; }.primary-action, .secondary-action { width: 100%; margin-top: 16px; padding: 14px; border-radius: var(--radius-sm); font-weight: 800; cursor: pointer; }.primary-action { border: 0; background: var(--color-primary); color: white; }.secondary-action { border: 1px solid var(--color-primary); background: transparent; color: var(--color-primary); }
</style>
