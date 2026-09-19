<script setup>
import BottomNav from '../components/common/BottomNav.vue'

const reservations = [
  { title: 'Amoxicilline 500 mg', pharmacy: 'Pharmacie du Centre', status: 'Confirmée', date: 'Aujourd’hui, 14:30' },
]
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><h1>Suivi</h1><p>Suivez vos réservations en cours.</p></div><section v-if="reservations.length" class="tracking-list"><article v-for="reservation in reservations" :key="reservation.title" class="surface tracking-card"><div class="tracking-card__top"><strong>{{ reservation.title }}</strong><span>{{ reservation.status }}</span></div><p>{{ reservation.pharmacy }}</p><small>Retrait prévu : {{ reservation.date }}</small><div class="progress"><i></i></div><div class="steps"><span>Réservée</span><span>Confirmée</span><span>Prête</span></div></article></section><section v-else class="surface empty-state"><strong>Aucune réservation en cours</strong>Vos prochaines réservations apparaîtront ici.</section></div><BottomNav /></main>
</template>

<style scoped>
.tracking-list { display: grid; gap: 14px; }.tracking-card { padding: 18px; }.tracking-card__top { display: flex; justify-content: space-between; gap: 12px; }.tracking-card__top span { color: var(--color-primary); font-size: 12px; font-weight: 800; }.tracking-card p { margin: 7px 0 4px; color: var(--color-text-muted); }.tracking-card small { color: var(--color-text-muted); font-size: 12px; }.progress { height: 6px; margin: 20px 0 8px; overflow: hidden; border-radius: var(--radius-full); background: var(--color-primary-light); }.progress i { display: block; width: 66%; height: 100%; border-radius: inherit; background: var(--color-primary); }.steps { display: flex; justify-content: space-between; color: var(--color-text-muted); font-size: 10px; font-weight: 700; }
</style>
