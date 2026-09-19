<script setup>
import BottomNav from '../components/common/BottomNav.vue'
const prescriptions = [{ id: 1, date: '13 mai 2025', doctor: 'Dr. Jean Dupont', status: 'En cours', medicines: 3 }, { id: 2, date: '02 avril 2025', doctor: 'Dr. Amina Loemba', status: 'Terminée', medicines: 2 }]
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><h1>Mes ordonnances</h1><p>Retrouvez vos traitements et leur suivi.</p></div><div class="tabs"><button class="active">Toutes</button><button>En cours</button><button>Terminées</button></div><section class="prescriptions"><RouterLink v-for="prescription in prescriptions" :key="prescription.id" :to="`/prescriptions/${prescription.id}`" class="surface prescription"><div><strong>Ordonnance du {{ prescription.date }}</strong><p>{{ prescription.doctor }} · {{ prescription.medicines }} médicaments</p></div><span>{{ prescription.status }}</span><b>›</b></RouterLink></section></div><BottomNav /></main>
</template>

<style scoped>
.tabs { display: flex; gap: 6px; margin-bottom: 16px; }.tabs button { padding: 8px 12px; border: 1px solid var(--color-border); border-radius: 999px; background: var(--color-surface); color: var(--color-text-muted); font-size: 11px; cursor: pointer; }.tabs .active { border-color: var(--color-primary); background: var(--color-primary); color: white; }.prescriptions { display: grid; gap: 10px; }.prescription { display: flex; align-items: center; gap: 10px; padding: 15px; color: var(--color-text); text-decoration: none; }.prescription div { flex: 1; }.prescription strong { font-size: 12px; }.prescription p { margin: 5px 0 0; color: var(--color-text-muted); font-size: 10px; }.prescription span { color: var(--color-primary); font-size: 10px; font-weight: 800; }.prescription b { color: var(--color-text-muted); font-size: 20px; }
</style>