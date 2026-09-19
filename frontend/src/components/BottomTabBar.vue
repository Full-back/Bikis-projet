<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const tabs = [
  { name: 'home', label: 'Accueil', icon: 'home' },
  { name: 'pharmacies', label: 'Rechercher', icon: 'search' },
  { name: 'scan', label: 'Ordonnance', icon: 'scan' },
  { name: 'prescriptions', label: 'Réservations', icon: 'bookmark' },
  { name: 'profile', label: 'Profil', icon: 'user' },
]

const activeTab = computed(() => route.name)

function goTo(tabName) {
  if (tabName !== activeTab.value) router.push({ name: tabName })
}
</script>

<template>
  <nav class="tabbar" role="navigation" aria-label="Navigation principale">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      class="tabbar__item"
      :class="{ 'tabbar__item--active': activeTab === tab.name }"
      :aria-current="activeTab === tab.name ? 'page' : undefined"
      @click="goTo(tab.name)"
    >
      <span class="tabbar__icon">
        <!-- home -->
        <svg v-if="tab.icon === 'home'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M4 11.5 12 4l8 7.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <!-- search -->
        <svg v-else-if="tab.icon === 'search'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="11" cy="11" r="6.5"/>
          <path d="m20 20-3.8-3.8" stroke-linecap="round"/>
        </svg>
        <!-- scan (ordonnance) -->
        <svg v-else-if="tab.icon === 'scan'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M4 8V5a1 1 0 0 1 1-1h3M4 16v3a1 1 0 0 0 1 1h3M20 8V5a1 1 0 0 0-1-1h-3M20 16v3a1 1 0 0 1-1 1h-3" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6 12h12" stroke-linecap="round"/>
        </svg>
        <!-- bookmark -->
        <svg v-else-if="tab.icon === 'bookmark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="M6 4h12v16l-6-4-6 4V4Z" stroke-linejoin="round"/>
        </svg>
        <!-- user -->
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <circle cx="12" cy="8" r="3.2"/>
          <path d="M5 20c1.2-3.6 4.2-5.5 7-5.5s5.8 1.9 7 5.5" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="tabbar__label">{{ tab.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--tabbar-height);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  display: flex;
  align-items: stretch;
  padding-bottom: env(safe-area-inset-bottom, 0);
  z-index: 50;
}

.tabbar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 6px 0;
}

.tabbar__icon {
  width: 22px;
  height: 22px;
}
.tabbar__icon svg {
  width: 100%;
  height: 100%;
}

.tabbar__label {
  font-size: 11px;
  font-weight: 600;
}

.tabbar__item--active {
  color: var(--color-primary);
}

.tabbar__item--active .tabbar__icon {
  color: var(--color-primary);
}
</style>