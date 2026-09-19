<script setup>
import BottomNav from '../components/common/BottomNav.vue'
import { usePharmacyStore } from '../stores/pharmacyStore'
const store = usePharmacyStore()
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><h1>Pharmacies proches</h1><p>Disponibilité et prix à Brazzaville</p></div><div class="filter surface"><span>⌕</span><input v-model="store.search" placeholder="Rechercher une pharmacie" aria-label="Rechercher une pharmacie" /></div><section class="pharmacy-list"><article v-for="pharmacy in store.pharmacies" :key="pharmacy.name" class="surface pharmacy"><div class="pharmacy__top"><strong>{{ pharmacy.name }}</strong><span class="available">Ouverte</span></div><p>{{ pharmacy.distance }} · {{ pharmacy.price }}</p><button type="button">Réserver</button></article></section></div><BottomNav /></main>
</template>

<style scoped>
.filter { display: flex; gap: 10px; align-items: center; padding: 11px 13px; margin-bottom: 16px; color: var(--color-text-muted); }.filter input { width: 100%; border: 0; outline: 0; background: none; color: var(--color-text); font-size: 13px; }.pharmacy-list { display: grid; gap: 10px; }.pharmacy { padding: 16px; }.pharmacy__top { display: flex; justify-content: space-between; gap: 10px; }.pharmacy strong { font-size: 14px; }.pharmacy p { margin: 7px 0 14px; color: var(--color-text-muted); font-size: 11px; }.available { color: var(--color-primary); font-size: 10px; font-weight: 800; }.pharmacy button { width: 100%; padding: 9px; border: 0; border-radius: 8px; background: var(--color-primary-light); color: var(--color-primary); font-size: 11px; font-weight: 800; cursor: pointer; }
</style>