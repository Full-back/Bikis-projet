<script setup>
import { onMounted, onUnmounted } from 'vue'
import bikisLogo from '../assets/images/bikis-logo.png'

const emit = defineEmits(['finish'])
let splashTimer

onMounted(() => {
  splashTimer = window.setTimeout(() => {
    emit('finish')
  }, 2500)
})

onUnmounted(() => {
  window.clearTimeout(splashTimer)
})
</script>

<template>
  <main class="splash-screen" role="status" aria-live="polite">
    <div class="splash-screen__glow splash-screen__glow--top" aria-hidden="true"></div>
    <div class="splash-screen__glow splash-screen__glow--bottom" aria-hidden="true"></div>

    <section class="splash-content">
      <img class="splash-logo" :src="bikisLogo" alt="Bikis" />
      <p class="slogan">Votre santé, au prix juste,<br />près de chez vous.</p>
      <div class="divider" aria-hidden="true"></div>
      <p class="loading-label">Chargement de l'application<span class="loading-dots" aria-hidden="true">...</span></p>
    </section>
  </main>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  overflow: hidden;
  padding: 32px 24px;
  background: #0a2f25;
  color: #ffffff;
  font-family: var(--font-base, 'Manrope', sans-serif);
}

.splash-screen__glow {
  position: absolute;
  width: 270px;
  height: 270px;
  border: 1px solid rgba(196, 228, 210, 0.12);
  border-radius: 50%;
}

.splash-screen__glow--top {
  top: -155px;
  right: -90px;
  box-shadow: 0 0 0 30px rgba(196, 228, 210, 0.035), 0 0 0 60px rgba(196, 228, 210, 0.02);
}

.splash-screen__glow--bottom {
  bottom: -190px;
  left: -120px;
  width: 330px;
  height: 330px;
}

.splash-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: content-appear 700ms ease-out both;
}

.splash-logo {
  display: block;
  width: min(220px, 72vw);
  height: auto;
  margin-bottom: 22px;
  object-fit: contain;
  filter: drop-shadow(0 16px 24px rgba(0, 0, 0, 0.2));
}

.slogan {
  margin: 16px 0 0;
  color: #c8e4d6;
  font-size: 15px;
  font-weight: 500;
  line-height: 1.55;
}

.divider {
  width: 42px;
  height: 2px;
  margin: 28px 0 20px;
  border-radius: 999px;
  background: #e8a33d;
}

.loading-label {
  margin: 0;
  color: rgba(220, 241, 229, 0.7);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.loading-dots {
  display: inline-block;
  width: 18px;
  text-align: left;
  animation: dots-pulse 1.2s steps(4, end) infinite;
}

@keyframes content-appear {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes dots-pulse {
  0%, 20% { opacity: 0.25; }
  50% { opacity: 1; }
  80%, 100% { opacity: 0.25; }
}

@media (prefers-reduced-motion: reduce) {
  .splash-content,
  .loading-dots { animation: none; }
}
</style>