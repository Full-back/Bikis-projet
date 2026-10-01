<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import BottomNav from '../components/common/BottomNav.vue'
import pharmacyImage from '../assets/images/image_1.jpg'
import scanBackground from '../assets/images/image_2.jpg'
import bikisLogo from '../assets/images/bikis-logo.png'

const router = useRouter()
const auth = useAuthStore()
const searchQuery = ref('')
const isDarkMode = ref(false)
const selectedPrescription = ref(null)
const fileInput = ref(null)
const searchInput = ref(null)
const isNotificationMenuOpen = ref(false)
const displayName = computed(() => [auth.user.firstName, auth.user.lastName].filter(Boolean).join(' '))

const notifications = ref([
  { id: 1, title: 'Réservation prête', text: 'Votre Amoxicilline est disponible.', time: 'Il y a 10 min', unread: true },
  { id: 2, title: 'Pharmacie du Centre', text: 'La disponibilité de votre produit a été confirmée.', time: 'Il y a 1 h', unread: true },
])
const unreadNotifications = computed(() => notifications.value.filter((notification) => notification.unread).length)


function onSearchSubmit() {
  if (!searchQuery.value.trim()) return
}

function openFilePicker() {
  fileInput.value?.click()
}

function openScanView() {
  router.push({ name: 'scan' })
}

function onPrescriptionSelected(event) {
  selectedPrescription.value = event.target.files?.[0] ?? null
}
</script>

<template>
  <main class="home" :class="{ 'home--dark': isDarkMode }">
    <div class="home__container">
      <header class="home__header">
        <div class="header-identity">
          <div class="brand-lockup" aria-label="Bikis">
            <img class="brand-logo" :src="bikisLogo" alt="Bikis" />
          </div>
          <button class="location-indicator" type="button" aria-label="Localisation actuelle : Brazzaville">
            <span class="location-indicator__pin" aria-hidden="true">⌖</span>
            <span><strong>Brazzaville</strong><small>Position active</small></span>
          </button>
        </div>
        <div class="header-actions">
          <div class="notification-menu">
            <button class="notification-trigger" :aria-expanded="isNotificationMenuOpen" aria-haspopup="menu" aria-label="Ouvrir les notifications" @click="isNotificationMenuOpen = !isNotificationMenuOpen">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              <span v-if="unreadNotifications" class="notification-badge">{{ unreadNotifications }}</span>
            </button>
            <div v-if="isNotificationMenuOpen" class="notification-dropdown" role="menu">
              <div class="notification-dropdown__header"><strong>Notifications</strong><button type="button" @click="notifications.forEach((notification) => { notification.unread = false })">Tout lire</button></div>
              <div v-if="notifications.length" class="notification-list">
                <button v-for="notification in notifications" :key="notification.id" class="notification-item" :class="{ 'notification-item--unread': notification.unread }" type="button" role="menuitem">
                  <span class="notification-item__dot" aria-hidden="true"></span><span><strong>{{ notification.title }}</strong><small>{{ notification.text }}</small><time>{{ notification.time }}</time></span>
                </button>
              </div>
              <p v-else class="notification-empty">Aucune notification.</p>
            </div>
          </div>

          <div v-if="!auth.isAuthenticated" class="auth-actions" aria-label="Accès au compte">
            <button class="auth-action auth-action--secondary" type="button" @click="router.push({ name: 'login' })">Se connecter</button>
            <button class="auth-action auth-action--primary" type="button" @click="router.push({ name: 'register' })">S'inscrire</button>
          </div>
          <div v-else class="signed-in-user">
            <span class="signed-in-user__avatar" aria-hidden="true">{{ displayName.charAt(0) }}</span>
            <span class="signed-in-user__name">{{ displayName }}</span>
          </div>
        </div>
      </header>

      <section class="welcome-block" :style="{ '--welcome-image': `url(${pharmacyImage})` }" aria-labelledby="welcome-title">
        <div class="welcome-block__overlay"></div>
        <div class="welcome-block__content">
          <p class="home__greeting">{{ auth.isAuthenticated ? `Bonjour ${displayName}` : 'Bienvenue sur Bikis' }} <span aria-hidden="true"></span></p>
          <h1 id="welcome-title" class="home__name">{{ auth.isAuthenticated ? displayName : 'Votre santé, simplifiée' }}</h1>
          <p class="home__subtitle">Trouvez vos médicaments et pharmacies<br />en temps réel à Brazzaville.</p>
        </div>
      </section>

      <section class="search-section">
        <form class="search" @submit.prevent="onSearchSubmit">
          <svg class="search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="11" cy="11" r="6.5"/>
            <path d="m20 20-3.8-3.8" stroke-linecap="round"/>
          </svg>
          <input ref="searchInput" v-model="searchQuery" type="search" placeholder="Rechercher un médicament disponible..." class="search__input" />
          <button v-if="searchQuery" type="button" class="search__clear" aria-label="Effacer la recherche" @click="searchQuery = ''">×</button>
        </form>
      </section>

      <section class="prescription-card">
        <button class="quick-actions__card quick-actions__card--primary" :style="{ '--scan-image': `url(${scanBackground})` }" type="button" @click="openScanView">
          <span class="quick-actions__title">Scanner une ordonnance</span>
          <span class="quick-actions__hint">Trouvez quelle pharmacie l'a en stock</span>
          <span class="scan-cta" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 7H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" stroke-linecap="round"/><path d="M8 7h8M9 4h6v3H9zM8 13h8" stroke-linecap="round" stroke-linejoin="round"/></svg><span>Scanner maintenant</span></span>
          <input ref="fileInput" class="file-input" type="file" accept="image/*,.pdf" @change="onPrescriptionSelected" />
          <span class="prescription-paper" aria-hidden="true"><b>Rx</b><i></i><i></i><i></i></span>
        </button>
      </section>

      <!-- Actions rapides recentrées uniquement sur la recherche et le scan -->
      <section class="quick-actions quick-actions--duo">
        <button class="quick-actions__card" @click="openFilePicker">
          <span class="quick-actions__icon" aria-hidden="true">⌑</span>
          <span class="quick-actions__title">Scanner un produit</span>
          <span class="quick-actions__hint">Code-barres ou boîte</span>
        </button>
        <button class="quick-actions__card" @click="searchInput?.focus()">
          <span class="quick-actions__icon" aria-hidden="true">⌖</span>
          <span class="quick-actions__title">Carte des stocks</span>
          <span class="quick-actions__hint">Voir les pharmacies ouvertes</span>
        </button>
      </section>

      <p v-if="selectedPrescription" class="upload-status" role="status">
        <span aria-hidden="true">✓</span> {{ selectedPrescription.name }} ajouté avec succès.
      </p>

      <section class="pharmacy-prompt">
        <span class="prompt-icon" aria-hidden="true">⌖</span>
        <span><strong>Géo-localisation active</strong><small>Recherche des stocks autour de vous</small></span>
        <button aria-label="Actualiser">›</button>
      </section>

      <section class="tips-banner">
        <div class="tips-banner__art" aria-hidden="true"><span class="tips-banner__cross">+</span><span class="tips-banner__pill tips-banner__pill--one"></span><span class="tips-banner__pill tips-banner__pill--two"></span></div>
        <div class="tips-banner__content"><span class="tips-icon" aria-hidden="true">♧</span><span><strong>Astuce Bikis</strong><small>Pensez à appeler la pharmacie pour confirmer la disponibilité exacte avant de vous déplacer.</small></span></div>
        <button aria-label="Voir le conseil">›</button>
      </section>


    </div>

  </main>
  <BottomNav />
</template>

<style scoped>
.home {
  --home-bg: #f4f1e8;
  --home-surface: #fffdf8;
  --home-text: #1c2420;
  --home-muted: #6b7570;
  --home-border: #d9e1d6;
  position: relative;
  min-height: 100svh;
  width: 100%;
  background: var(--home-bg);
  color: var(--home-text);
  padding: 24px 18px 120px;
  transition: background 180ms ease, color 180ms ease;
}

@media (min-width: 900px) {
  .home__container {
    max-width: 900px;
    margin: 0 auto;
  }
}

.home--dark { 
  --home-bg: #031b14; 
  --home-surface: #082c21; 
  --home-text: #f2f7f3; 
  --home-muted: #9db8aa; 
  --home-border: #1c4939; 
}

.home__container { max-width: 1120px; margin: 0 auto; padding-top: 82px; }

@media (max-width: 600px) {
  .home {
    padding-bottom: calc(120px + env(safe-area-inset-bottom, 0px));
  }
}

.home__header { position: fixed; top: 0; left: 0; z-index: 90; display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; width: 100%; padding: 14px max(18px, calc((100vw - 1120px) / 2)); border-bottom: 1px solid var(--home-border); background: color-mix(in srgb, var(--home-bg) 92%, transparent); box-shadow: 0 8px 24px rgba(12, 49, 37, .08); backdrop-filter: blur(14px); }
.header-identity { min-width: 0; }
.brand-lockup { display: flex; align-items: center; }
.brand-logo { display: block; width: 118px; height: 42px; object-fit: contain; object-position: left center; }
.location-indicator { display: inline-flex; align-items: center; gap: 6px; margin-top: 8px; padding: 0; border: 0; background: transparent; color: var(--home-text); text-align: left; cursor: pointer; }
.location-indicator__pin { display: grid; place-items: center; width: 22px; height: 22px; border-radius: 7px; background: var(--color-primary-light); color: var(--color-primary); font-size: 15px; }
.location-indicator span:last-child { display: grid; gap: 1px; }
.location-indicator strong { font-size: 10px; line-height: 1.1; }.location-indicator small { color: var(--home-muted); font-size: 8px; line-height: 1.1; }
.home__greeting { margin: 0; color: var(--color-primary); font-size: 19px; font-weight: 700; line-height: 1.1; }
.home__name { margin: 8px 0 12px; color: #174c3b; font-size: clamp(38px, 5vw, 56px); font-weight: 800; letter-spacing: -1px; line-height: 1; }
.home--dark .home__greeting, .home--dark .home__name { color: #f2f7f3; }
.home__subtitle { margin: 0; color: var(--home-muted); font-size: 16px; line-height: 1.5; }
.welcome-block { position: relative; min-height: 190px; margin-bottom: 26px; overflow: hidden; border-radius: 20px; background: #17613f; box-shadow: 0 14px 30px rgba(23, 76, 59, .12); }
.welcome-block::before { content: ''; position: absolute; inset: -10px; background: var(--welcome-image) center / cover no-repeat; filter: blur(3px); transform: scale(1.03); }
.welcome-block__overlay { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(4, 53, 35, .88) 0%, rgba(6, 91, 55, .68) 52%, rgba(6, 91, 55, .2) 100%); }
.welcome-block__content { position: relative; z-index: 1; display: flex; min-height: 190px; flex-direction: column; align-items: flex-start; justify-content: center; padding: 25px clamp(25px, 6vw, 64px); color: #fff; text-align: left; }
.welcome-block .home__greeting, .welcome-block .home__name, .welcome-block .home__subtitle { color: #fff; }
.welcome-block .home__greeting { color: #bdf0c9; }.welcome-block .home__name { margin-top: 6px; }.welcome-block .home__subtitle { color: rgba(255, 255, 255, .82); }
.home--dark .welcome-block__overlay { background: linear-gradient(90deg, rgba(2, 27, 20, .92) 0%, rgba(3, 73, 45, .78) 55%, rgba(3, 27, 20, .35) 100%); }
.header-actions { display: flex; align-items: center; gap: 9px; }
.notification-menu { position: relative; z-index: 10; }
.notification-trigger { position: relative; display: grid; place-items: center; width: 42px; height: 42px; border: 1px solid var(--home-border); border-radius: 14px; background: var(--home-surface); color: var(--home-text); cursor: pointer; }
.notification-trigger svg { width: 20px; height: 20px; }
.notification-badge { position: absolute; top: -5px; right: -4px; display: grid; place-items: center; min-width: 18px; height: 18px; padding: 0 4px; border: 2px solid var(--home-bg); border-radius: 999px; background: #c1503e; color: #fff; font-size: 9px; font-weight: 800; }
.notification-dropdown { position: fixed; top: 72px; right: 14px; width: min(320px, calc(100vw - 28px)); overflow: hidden; border: 1px solid var(--home-border); border-radius: 16px; background: var(--home-surface); box-shadow: 0 16px 35px rgba(12, 49, 37, .18); }
.notification-dropdown__header { display: flex; align-items: center; justify-content: space-between; padding: 14px 15px; border-bottom: 1px solid var(--home-border); }
.notification-dropdown__header strong { color: var(--home-text); font-size: 13px; }
.notification-dropdown__header button { border: 0; background: transparent; color: var(--color-primary); font-size: 10px; font-weight: 800; cursor: pointer; }
.notification-list { display: grid; max-height: 280px; overflow-y: auto; }
.notification-item { display: flex; align-items: flex-start; gap: 9px; width: 100%; padding: 12px 15px; border: 0; border-bottom: 1px solid var(--home-border); background: transparent; color: var(--home-text); text-align: left; cursor: pointer; }
.notification-item:hover, .notification-item--unread { background: var(--home-bg); }
.notification-item__dot { width: 7px; height: 7px; flex-shrink: 0; margin-top: 4px; border-radius: 50%; background: transparent; }
.notification-item--unread .notification-item__dot { background: #c1503e; }
.notification-item span:last-child { display: grid; gap: 3px; }
.notification-item strong { font-size: 11px; }.notification-item small, .notification-item time { color: var(--home-muted); font-size: 10px; }.notification-item time { font-size: 9px; }
.notification-empty { margin: 0; padding: 24px 15px; color: var(--home-muted); font-size: 11px; text-align: center; }
.auth-actions { display: flex; align-items: center; gap: 6px; }
.auth-action { padding: 10px 12px; border: 1px solid var(--home-border); border-radius: 10px; font-size: 10px; font-weight: 800; white-space: nowrap; cursor: pointer; transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease; }
.auth-action:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(23, 76, 59, .12); }
.auth-action--secondary { background: var(--home-surface); color: var(--color-primary); }
.auth-action--primary { border-color: var(--color-primary); background: var(--color-primary); color: #fff; }
.signed-in-user { display: flex; align-items: center; gap: 7px; max-width: 180px; padding: 5px 9px 5px 5px; border: 1px solid var(--home-border); border-radius: 999px; background: var(--home-surface); }
.signed-in-user__avatar { display: grid; flex: 0 0 30px; height: 30px; place-items: center; border-radius: 50%; background: var(--color-primary); color: #fff; font-size: 12px; font-weight: 800; }
.signed-in-user__name { overflow: hidden; color: var(--home-text); font-size: 10px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; }
.account-trigger { display: flex; align-items: center; gap: 4px; padding: 5px; border: 1px solid var(--home-border); border-radius: 16px; background: var(--home-surface); color: var(--home-muted); cursor: pointer; }
.profile-button { display: grid; place-items: center; width: 38px; height: 38px; border: 2px solid #61b28a; border-radius: 50%; background: #d29a64; color: #fff; font-weight: 800; }
.account-trigger__chevron { font-size: 18px; line-height: 1; transition: transform 160ms ease; }
.account-trigger__chevron--open { transform: rotate(180deg); }
.account-dropdown { position: absolute; top: calc(100% + 9px); right: 0; width: 220px; overflow: hidden; border: 1px solid var(--home-border); border-radius: 16px; background: var(--home-surface); box-shadow: 0 16px 35px rgba(12, 49, 37, .18); }
.account-dropdown__identity { display: grid; gap: 3px; padding: 14px 15px; border-bottom: 1px solid var(--home-border); }
.account-dropdown__identity strong { color: var(--home-text); font-size: 13px; }
.account-dropdown__identity small { color: var(--home-muted); font-size: 10px; }
.account-dropdown__item { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 12px 15px; border: 0; border-bottom: 1px solid var(--home-border); background: transparent; color: var(--home-text); text-align: left; font-size: 11px; cursor: pointer; }
.account-dropdown__item:hover { background: var(--home-bg); }
.account-dropdown__item span { color: var(--home-muted); font-size: 18px; }
.account-dropdown__item--muted { border-bottom: 0; color: var(--color-danger); }
.account-theme { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 11px 15px; border-bottom: 1px solid var(--home-border); }
.account-theme > span { color: var(--home-muted); font-size: 10px; font-weight: 700; }
.theme-switcher { display: flex; flex-shrink: 0; padding: 3px; border: 1px solid var(--home-border); border-radius: 999px; background: var(--home-bg); opacity: .92; }
.theme-switcher button { width: 29px; height: 27px; border: 0; border-radius: 50%; background: transparent; color: var(--home-muted); cursor: pointer; }
.theme-switcher__button--active { background: var(--color-primary); color: #fff !important; }
.search-section { position: relative; z-index: 3; width: 100%; margin-bottom: 14px; }
.search { display: flex; align-items: center; gap: 10px; padding: 11px 13px; border: 1px solid var(--home-border); border-radius: 9px; background: var(--home-surface); }
.search__icon { width: 19px; height: 19px; flex-shrink: 0; color: var(--color-primary); }
.search__input { width: 100%; min-width: 0; border: 0; outline: 0; background: transparent; color: var(--home-text); font: inherit; font-size: 13px; }
.search__input::placeholder { color: var(--home-muted); }
.search__clear { border: 0; background: transparent; color: var(--home-muted); font-size: 20px; cursor: pointer; }
.prescription-card { position: relative; z-index: 1; width: 100%; margin-bottom: 12px; }

/* Grille à 2 colonnes pour les actions restantes (Scan produit et Carte des stocks) */
.quick-actions--duo { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 12px; }
.quick-actions__card { position: relative; display: flex; min-height: 122px; flex-direction: column; align-items: flex-start; justify-content: flex-end; gap: 4px; padding: 13px; border: 1px solid var(--home-border); border-radius: 14px; background: var(--home-surface); color: var(--home-text); text-align: left; cursor: pointer; transition: transform 160ms ease, box-shadow 160ms ease; }
.prescription-card .quick-actions__card { min-height: 164px; width: 100%; padding: 18px 122px 18px 17px; border-radius: 14px; }
.quick-actions__card:hover { box-shadow: 0 12px 24px rgba(23, 76, 59, .1); transform: translateY(-2px); }
.quick-actions__card:active { transform: scale(.98); }
.quick-actions__card--primary { isolation: isolate; overflow: hidden; border-color: #187b4f; background: #087946; color: #fff; }
.quick-actions__card--primary::before { content: ''; position: absolute; inset: -12px; z-index: -2; background: var(--scan-image) center / cover no-repeat; filter: blur(4px); transform: scale(1.05); }
.quick-actions__card--primary::after { content: ''; position: absolute; inset: 0; z-index: -1; background: linear-gradient(105deg, rgba(8, 121, 70, .9), rgba(9, 91, 56, .72)); }
.quick-actions__card--primary > * { position: relative; z-index: 1; }
.quick-actions__icon { position: absolute; top: 10px; left: 10px; display: grid; place-items: center; width: 27px; height: 27px; border-radius: 8px; background: rgba(255,255,255,.1); color: #55bf87; font-size: 18px; }
.quick-actions__title { font-size: 14px; font-weight: 800; line-height: 1.2; }
.quick-actions__hint { max-width: 175px; color: var(--home-muted); font-size: 10px; line-height: 1.35; }
.quick-actions__card--primary .quick-actions__hint { color: #c8e4d6; }
.scan-cta { display: inline-flex; align-items: center; gap: 6px; width: fit-content; margin-top: 8px; padding: 8px 11px; border-radius: 7px; background: #fff; color: #087946; font-size: 9px; font-weight: 800; box-shadow: 0 4px 10px rgba(0, 0, 0, .12); }
.scan-cta svg { width: 14px; height: 14px; flex-shrink: 0; }
.file-input { display: none; }
.prescription-paper { position: absolute; right: 17px; bottom: -4px; display: grid; width: 72px; height: 116px; padding: 9px 7px; transform: rotate(7deg); background: #f4f1e9; box-shadow: 0 5px 14px rgba(0,0,0,.25); color: #354038; font-size: 10px; }
.prescription-paper b { font-family: serif; font-size: 18px; }.prescription-paper b::after { content: ' Dr.'; font-size: 6px; }
.prescription-paper i { display: block; width: 42px; height: 2px; background: #89948a; }
.pharmacy-prompt, .tips-banner { display: flex; align-items: center; gap: 11px; padding: 13px; border: 1px solid var(--home-border); border-radius: 14px; background: var(--home-surface); margin-bottom: 12px; }
.prompt-icon, .tips-icon { display: grid; place-items: center; width: 27px; height: 27px; border-radius: 8px; background: #123f30; color: #55bf87; font-size: 18px; }
.pharmacy-prompt span:nth-child(2), .tips-banner span:nth-child(2) { display: grid; flex: 1; gap: 2px; }
.pharmacy-prompt strong, .tips-banner strong { font-size: 10px; }
.pharmacy-prompt small, .tips-banner small { color: var(--home-muted); font-size: 9px; }
.pharmacy-prompt button { border: 0; background: transparent; color: #73c897; font-size: 22px; cursor: pointer; }
.tips-banner { position: relative; min-height: 96px; overflow: hidden; padding: 14px 13px; border-color: #b9d9c4; background: linear-gradient(105deg, #e9f5ed, #d8eee2); }
.tips-banner::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(233, 245, 237, .96) 0%, rgba(233, 245, 237, .78) 56%, rgba(233, 245, 237, .18) 100%); pointer-events: none; }
.tips-banner__art { position: absolute; right: 13px; bottom: -10px; width: 112px; height: 112px; border-radius: 50%; background: radial-gradient(circle at 35% 30%, #c4e9ce 0 9%, transparent 10%), linear-gradient(145deg, #66c986, #2b9c68); opacity: .72; transform: rotate(-10deg); }
.tips-banner__cross { position: absolute; top: 25px; left: 29px; display: grid; place-items: center; width: 47px; height: 47px; border-radius: 14px; background: rgba(255,255,255,.75); color: #13814f; font-size: 40px; font-weight: 300; line-height: 1; }
.tips-banner__pill { position: absolute; display: block; width: 14px; height: 34px; border-radius: 999px; background: #f7fff9; box-shadow: 0 5px 8px rgba(16, 93, 55, .16); transform: rotate(42deg); }
.tips-banner__pill--one { right: 19px; top: 16px; }.tips-banner__pill--two { right: 36px; bottom: 12px; transform: rotate(-24deg); }
.tips-banner__content { position: relative; z-index: 1; display: flex; align-items: center; gap: 9px; max-width: calc(100% - 20px); }
.tips-banner__content > span:last-child { display: grid; flex: 1; gap: 4px; }.tips-banner__content strong { color: #145c3c; font-size: 12px; }.tips-banner__content small { max-width: 310px; color: #47715d; font-size: 10px; line-height: 1.4; }.tips-banner > button { position: relative; z-index: 1; }
.home--dark .tips-banner { border-color: #2b6b4b; background: linear-gradient(105deg, #123c2d, #164b38); }.home--dark .tips-banner::after { background: linear-gradient(90deg, rgba(18, 60, 45, .97) 0%, rgba(18, 60, 45, .78) 56%, rgba(18, 60, 45, .16) 100%); }.home--dark .tips-banner__content strong { color: #d9f4e2; }.home--dark .tips-banner__content small { color: #a9d2b7; }
.upload-status { margin: 0 0 19px; padding: 9px 12px; border-radius: 10px; background: var(--color-primary-light); color: var(--color-primary); font-size: 11px; }
.section { margin: 30px 0 0; }
.section__head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; margin-bottom: 11px; }
.section__head h2 { margin: 0; color: var(--home-text); font-size: 18px; letter-spacing: -.2px; }
.section__link { padding: 0; border: 0; background: none; color: var(--color-primary); font: inherit; font-size: 11px; font-weight: 800; cursor: pointer; }
.home--dark .section__link { color: #a8d4bd; }
.pharmacy-list { display: flex; flex-direction: column; gap: 9px; }
.pharmacy-card { display: flex; align-items: center; gap: 10px; padding: 14px; border: 1px solid var(--home-border); border-radius: 14px; background: var(--home-surface); }
.pharmacy-card__icon { display: grid; place-items: center; width: 32px; height: 32px; flex-shrink: 0; border-radius: 9px; background: var(--color-primary-light); color: var(--color-primary); font-weight: 800; }
.pharmacy-card__content { min-width: 0; flex: 1; }
.pharmacy-card__name { overflow: hidden; margin: 0 0 2px; font-size: 12px; font-weight: 800; text-overflow: ellipsis; white-space: nowrap; }
.pharmacy-card__distance { margin: 0; color: var(--home-muted); font-size: 10px; }
.pharmacy-card__badge { flex-shrink: 0; padding: 5px 8px; border-radius: 999px; background: var(--color-primary-light); color: var(--color-primary); font-size: 9px; font-weight: 800; white-space: nowrap; }
.pharmacy-card__badge--closed { background: #f3e4e1; color: var(--color-danger); }

@media (min-width: 720px) {
  .home { padding: 38px 42px 132px; }
  .home__container { padding-top: 92px; }
  .home__header { align-items: center; }
  .home__header > div:first-child { flex: 1; }
  .pharmacy-prompt, .tips-banner { min-height: 72px; }
  .pharmacy-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1080px) {
  .home__container { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(280px, .65fr); column-gap: 28px; }
  .home__header, .welcome-block, .search-section, .prescription-card, .quick-actions--duo { grid-column: 1 / -1; }
  .pharmacy-prompt, .tips-banner, .section { align-self: start; }
  .quick-actions--duo { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .pharmacy-list { grid-template-columns: 1fr; }
}

@media (max-width: 420px) {
  .auth-actions { gap: 4px; }
  .auth-action { padding: 8px 7px; font-size: 9px; }
  .brand-logo { width: 106px; height: 38px; }
  .home { padding-right: 13px; padding-left: 13px; }
  .location-indicator small { display: none; }
  .location-indicator strong { font-size: 9px; }
  .account-dropdown { right: -3px; width: 205px; }
  .quick-actions--duo { gap: 6px; }
  .quick-actions__card { min-height: 112px; padding: 9px; }
  .quick-actions__title { font-size: 10px; }
}
</style>