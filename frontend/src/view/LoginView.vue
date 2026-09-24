<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const loginIdentifier = ref('')
const password = ref('')
const errorMessage = ref('')

function submit() {
  errorMessage.value = ''
  if (!auth.login(loginIdentifier.value)) {
    errorMessage.value = 'Aucun compte ne correspond à cet email ou numéro de téléphone.'
    return
  }

  router.push({ name: 'home' })
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-panel">
      <button class="back-button" type="button" aria-label="Retourner à l'accueil" @click="router.push({ name: 'home' })">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
      </button>
      <p class="eyebrow">Bikis</p>
      <h1>Connexion</h1>
      <p class="intro">Retrouvez vos ordonnances et vos réservations.</p>
      <form @submit.prevent="submit">
        <label>
          Email ou numéro de téléphone
          <input
            v-model="loginIdentifier"
            type="text"
            inputmode="email"
            autocomplete="username"
            placeholder="ex. vous@email.com ou 06 123 45 67"
            required
          />
        </label>
        <label>Mot de passe<input v-model="password" type="password" autocomplete="current-password" required /></label>
        <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
        <button class="primary-action" type="submit">Se connecter</button>
      </form>
      <p class="switch-link">Pas encore de compte ? <button type="button" @click="router.push({ name: 'register' })">Créer un compte</button></p>
    </section>
  </main>
</template>

<style scoped>
.auth-page { display: grid; min-height: 100svh; place-items: center; padding: 24px; background: var(--color-bg); }
.auth-panel { width: min(100%, 420px); padding: 32px 24px; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); }
.back-button { display: grid; width: 54px; height: 54px; margin-bottom: 18px; place-items: center; border: 0; border-radius: 50%; background: #4abd98; color: #fff; cursor: pointer; box-shadow: 0 8px 18px rgba(74, 189, 152, .2); transition: transform 160ms ease, background-color 160ms ease, box-shadow 160ms ease; }
.back-button svg { width: 29px; height: 29px; fill: none; stroke: currentColor; stroke-linecap: round; stroke-linejoin: round; stroke-width: 2.8; }
.back-button:hover, .back-button:focus-visible { background: #36aa83; box-shadow: 0 10px 22px rgba(74, 189, 152, .28); transform: translateX(-2px); }
.eyebrow { margin: 0 0 8px; color: var(--color-primary); font-weight: 800; }
h1 { margin: 0 0 8px; font-size: 30px; } .intro { margin: 0 0 24px; color: var(--color-text-muted); }
form { display: grid; gap: 16px; } label { display: grid; gap: 7px; font-size: 13px; font-weight: 700; }
input { width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: var(--color-bg); color: var(--color-text); }
.primary-action { padding: 13px; border: 0; border-radius: var(--radius-sm); background: var(--color-primary); color: white; font-weight: 800; cursor: pointer; }
.error-message { margin: -4px 0 0; color: var(--color-danger); font-size: 12px; }
.switch-link { margin: 20px 0 0; color: var(--color-text-muted); font-size: 13px; text-align: center; } .switch-link button { border: 0; background: transparent; color: var(--color-primary); font-weight: 800; cursor: pointer; }
</style>
