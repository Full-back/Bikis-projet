<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter(); const route = useRoute()
const tabs = [
  { name: 'home', label: 'Accueil', icon: 'home' },
  { name: 'pharmacies', label: 'Recherche', icon: 'search' },
  { name: 'prescriptions', label: 'Favoris', icon: 'bookmark' },
  { name: 'profile', label: 'Profil', icon: 'user' },
]
const active = computed(() => route.name)
</script>

<template>
  <nav class="bottom-nav" aria-label="Navigation principale">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      type="button"
      :class="{ active: active === tab.name }"
      :aria-current="active === tab.name ? 'page' : undefined"
      @click="router.push({ name: tab.name })"
    >
      <span class="bottom-nav__icon" aria-hidden="true">
        <svg v-if="tab.icon === 'home'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="m4 10.5 8-6.5 8 6.5v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1v-8Z" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="tab.icon === 'search'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-3.8-3.8" stroke-linecap="round" />
        </svg>
        <svg v-else-if="tab.icon === 'bookmark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M6 4h12v16l-6-4-6 4V4Z" stroke-linejoin="round" />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20c1.2-3.6 4.2-5.5 7-5.5s5.8 1.9 7 5.5" stroke-linecap="round" />
        </svg>
      </span>
      <small>{{ tab.label }}</small>
    </button>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  right: 12px;
  bottom: calc(12px + env(safe-area-inset-bottom, 0px));
  left: 12px;
  z-index: 20;
  display: flex;
  height: 70px;
  padding: 7px;
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, white);
  border-radius: 22px;
  background: color-mix(in srgb, var(--color-surface) 92%, transparent);
  box-shadow: 0 12px 30px rgb(31 92 76 / 13%);
  backdrop-filter: blur(18px);
}

.bottom-nav button {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  border: 0;
  border-radius: 16px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color 160ms ease, background 160ms ease, transform 160ms ease;
}

.bottom-nav button:hover { color: var(--color-primary); }
.bottom-nav button:active { transform: scale(.96); }
.bottom-nav button.active { color: var(--color-primary); background: var(--color-primary-light); }
.bottom-nav__icon { display: grid; width: 22px; height: 22px; place-items: center; }
.bottom-nav__icon svg { width: 100%; height: 100%; }
.bottom-nav small { font-size: 10px; font-weight: 800; letter-spacing: .01em; }

@media (min-width: 768px) {
  .bottom-nav {
    right: 50%;
    bottom: 18px;
    left: auto;
    width: min(100% - 64px, 560px);
    height: 72px;
    transform: translateX(50%);
    border: 1px solid color-mix(in srgb, var(--color-border) 72%, white);
    border-radius: 22px;
  }
}
</style>