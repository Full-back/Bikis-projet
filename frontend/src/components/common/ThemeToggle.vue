<script setup>
import { onMounted, ref, watch } from 'vue'

const isDark = ref(false)
function applyTheme() { document.body.dataset.theme = isDark.value ? 'dark' : 'light' }
onMounted(() => { isDark.value = localStorage.getItem('bikis-theme') === 'dark'; applyTheme() })
watch(isDark, (value) => { localStorage.setItem('bikis-theme', value ? 'dark' : 'light'); applyTheme() })
</script>

<template>
  <button class="theme-toggle" type="button" :aria-label="isDark ? 'Activer le mode jour' : 'Activer le mode nuit'" @click="isDark = !isDark">
    {{ isDark ? '☀' : '☾' }}
  </button>
</template>

<style scoped>
.theme-toggle { width: 36px; height: 36px; border: 1px solid var(--color-border); border-radius: 50%; background: var(--color-surface); color: var(--color-text); cursor: pointer; }
</style>