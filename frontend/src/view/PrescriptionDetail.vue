<script setup>
import BottomNav from '../components/common/BottomNav.vue'
</script>

<template>
  <main class="page"><div class="page__content"><div class="view-heading"><RouterLink to="/prescriptions">‹ Mes ordonnances</RouterLink><h1>Ordonnance du 13 mai</h1><p>Dr. Jean Dupont · En cours</p></div><section class="surface detail"><h2>Traitement</h2><p>Amoxicilline 500 mg · 7 jours</p><p>Paracétamol 1 g · Si besoin</p><p>Vitamine C 500 mg · 10 jours</p></section><section class="surface progress"><h2>Suivi du traitement</h2><div><span class="done">✓</span><span class="line"></span><span>Jour 4</span><span class="line"></span><span>Jour 7</span></div></section><RouterLink class="primary-action" to="/pharmacies">Trouver ces médicaments</RouterLink></div><BottomNav /></main>
</template>

<style scoped>
.view-heading a { color: var(--color-primary); font-size: 12px; text-decoration: none; }.view-heading h1 { margin-top: 16px; }.detail, .progress { margin-bottom: 12px; padding: 18px; }.detail h2, .progress h2 { margin: 0 0 14px; font-size: 15px; }.detail p { margin: 0; padding: 11px 0; border-top: 1px solid var(--color-border); color: var(--color-text-muted); font-size: 12px; }.progress div { display: flex; align-items: center; color: var(--color-text-muted); font-size: 11px; }.progress span { flex-shrink: 0; }.done { display: grid; place-items: center; width: 24px; height: 24px; border-radius: 50%; background: var(--color-primary); color: white; }.line { height: 1px; flex: 1; margin: 0 7px; background: var(--color-border); }.primary-action { display: block; padding: 14px; border-radius: 10px; background: var(--color-primary); color: white; text-align: center; text-decoration: none; font-size: 13px; font-weight: 800; }
</style>