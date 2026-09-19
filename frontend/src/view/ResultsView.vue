<script setup>
import BottomNav from '../components/common/BottomNav.vue'
const medicines = [{ name: 'Amoxicilline 500 mg', instruction: '2 comprimés, 3 fois par jour', status: 'Disponible' }, { name: 'Paracétamol 1 g', instruction: '1 comprimé si besoin', status: 'Disponible' }, { name: 'Vitamine C 500 mg', instruction: '1 comprimé par jour', status: 'À vérifier' }]
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><RouterLink to="/scan">‹ Retour</RouterLink><h1>Médicaments détectés</h1><p>Vérifiez les informations avant de chercher une pharmacie.</p></div><section class="surface results-list"><article v-for="medicine in medicines" :key="medicine.name"><div><strong>{{ medicine.name }}</strong><p>{{ medicine.instruction }}</p></div><span :class="{ warning: medicine.status !== 'Disponible' }">{{ medicine.status }}</span></article></section><RouterLink class="primary-action" to="/pharmacies">Comparer les pharmacies</RouterLink></div><BottomNav /></main>
</template>

<style scoped>
.view-heading a { color: var(--color-primary); font-size: 12px; text-decoration: none; }.view-heading h1 { margin-top: 16px; }.results-list { overflow: hidden; }.results-list article { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 16px; border-bottom: 1px solid var(--color-border); }.results-list article:last-child { border-bottom: 0; }.results-list strong { font-size: 13px; }.results-list p { margin: 5px 0 0; color: var(--color-text-muted); font-size: 11px; }.results-list span { color: var(--color-primary); font-size: 10px; font-weight: 800; }.results-list .warning { color: var(--color-danger); }.primary-action { display: block; margin-top: 16px; padding: 14px; border-radius: 10px; background: var(--color-primary); color: white; text-align: center; text-decoration: none; font-size: 13px; font-weight: 800; }
</style>