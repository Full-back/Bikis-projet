<script setup>
import { useRoute, useRouter } from 'vue-router'
import BottomNav from '../components/common/BottomNav.vue'

const route = useRoute()
const router = useRouter()
const pharmacyName = route.query.name || 'Pharmacie du Centre'
</script>

<template>
  <main class="page"><div class="page__content">
    <button class="back" type="button" @click="router.back()">← Retour</button>
    <div class="view-heading"><h1>{{ pharmacyName }}</h1><p>Informations, stock et horaires.</p></div>
    <section class="surface detail-card"><span class="status">Ouverte maintenant</span><strong>À 1,2 km de vous</strong><p>12 avenue de la Paix, Brazzaville</p><div class="detail-row"><span>Horaires</span><b>08:00 - 20:00</b></div><div class="detail-row"><span>Téléphone</span><b>+242 06 000 00 00</b></div></section>
    <button class="primary-action" type="button" @click="router.push({ name: 'reservation-confirm', query: { pharmacy: pharmacyName } })">Réserver un médicament</button>
  </div><BottomNav /></main>
</template>

<style scoped>
.back { margin-bottom: 20px; border: 0; background: transparent; color: var(--color-primary); font-weight: 800; cursor: pointer; }.detail-card { display: grid; gap: 12px; padding: 20px; }.detail-card p { margin: 0; color: var(--color-text-muted); }.status { width: fit-content; padding: 6px 10px; border-radius: var(--radius-full); background: var(--color-primary-light); color: var(--color-primary); font-size: 12px; font-weight: 800; }.detail-row { display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid var(--color-border); font-size: 13px; }.primary-action { width: 100%; margin-top: 16px; padding: 14px; border: 0; border-radius: var(--radius-sm); background: var(--color-primary); color: white; font-weight: 800; cursor: pointer; }
</style>
