<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const confirmed = ref(false)
const pharmacy = route.query.pharmacy || 'Pharmacie du Centre'
const medicines = (() => {
  try {
    const parsed = JSON.parse(route.query.medicines || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
})()
const totalPrice = route.query.price ? `${new Intl.NumberFormat('fr-FR').format(Number(route.query.price))} FCFA` : 'À confirmer'
const availability = route.query.availableCount && route.query.totalCount
  ? `${route.query.availableCount} sur ${route.query.totalCount} médicaments disponibles`
  : route.query.complete === 'false' ? 'Disponibilité partielle à confirmer' : 'Tous les médicaments sont disponibles'

function confirmReservation() {
  confirmed.value = true
}
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><h1>{{ confirmed ? 'Demande envoyée' : 'Demander une réservation' }}</h1><p>{{ confirmed ? 'Votre demande a été enregistrée pour cette démonstration.' : 'Vérifiez les informations avant d’envoyer votre demande.' }}</p></div><section class="surface summary"><div><span>Pharmacie</span><strong>{{ pharmacy }}</strong></div><div><span>Médicaments demandés</span><strong v-if="!medicines.length">Aucun détail disponible</strong><ul v-else><li v-for="medicine in medicines" :key="medicine.id">{{ medicine.name }} {{ medicine.dosage }} · {{ medicine.form }} · {{ medicine.quantity }} boîte(s)</li></ul></div><div><span>Disponibilité</span><strong>{{ availability }}</strong></div><div><span>Prix estimé</span><strong>{{ totalPrice }}</strong></div></section><button v-if="!confirmed" class="primary-action" type="button" @click="confirmReservation">Envoyer la demande</button><button v-else class="secondary-action" type="button" @click="router.push({ name: 'tracking' })">Voir le suivi</button></div></main>
</template>

<style scoped>
.summary { display: grid; gap: 16px; padding: 20px; }.summary div { display: grid; gap: 5px; }.summary span { color: var(--color-text-muted); font-size: 12px; }.summary strong { font-size: 14px; }.summary ul { display: grid; gap: 7px; margin: 0; padding-left: 18px; font-size: 13px; }.primary-action, .secondary-action { width: 100%; margin-top: 16px; padding: 14px; border-radius: var(--radius-sm); font-weight: 800; cursor: pointer; }.primary-action { border: 0; background: var(--color-primary); color: white; }.secondary-action { border: 1px solid var(--color-primary); background: transparent; color: var(--color-primary); }
</style>
