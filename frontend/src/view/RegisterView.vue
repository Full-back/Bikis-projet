<template>
  <div class="auth-page">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="logo">Bikis</h1>
        <p class="subtitle">Créez votre compte pour rechercher et réserver vos médicaments</p>
      </div>

      <form class="auth-form" @submit.prevent="handleRegister">
        <!-- Nom et prénom -->
        <div class="name-fields">
          <div class="field">
            <label for="lastName">Nom</label>
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              placeholder="Mabiala"
              autocomplete="family-name"
              required
            />
            <p v-if="errors.lastName" class="error">{{ errors.lastName }}</p>
          </div>

          <div class="field">
            <label for="firstName">Prénom</label>
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              placeholder="Jean"
              autocomplete="given-name"
              required
            />
            <p v-if="errors.firstName" class="error">{{ errors.firstName }}</p>
          </div>
        </div>
        <!-- Email -->
        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="vous@email.com"
            autocomplete="email"
            required
          />
          <p v-if="errors.email" class="error">{{ errors.email }}</p>
        </div>
        <!-- Téléphone -->
        <div class="field">
          <label for="phone">Téléphone</label>
          <input
            id="phone"
            v-model="form.phone"
            type="tel"
            placeholder="ex. 06 123 45 67"
            autocomplete="tel"
            required
          />
          <p v-if="errors.phone" class="error">{{ errors.phone }}</p>
        </div>

        <!-- Ville / localisation -->
        <div class="field">
          <label for="city">Ville</label>
          <input
            id="city"
            v-model="form.city"
            type="text"
            placeholder="ex. Pointe-Noire"
            autocomplete="address-level2"
            required
          />
          <p v-if="errors.city" class="error">{{ errors.city }}</p>
        </div>

        <!-- Mot de passe -->
        <div class="field">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="8 caractères minimum"
            autocomplete="new-password"
            required
          />
          <p v-if="errors.password" class="error">{{ errors.password }}</p>
        </div>

        <!-- Confirmation mot de passe -->
        <div class="field">
          <label for="passwordConfirm">Confirmer le mot de passe</label>
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            type="password"
            placeholder="Retapez votre mot de passe"
            autocomplete="new-password"
            required
          />
          <p v-if="errors.passwordConfirm" class="error">{{ errors.passwordConfirm }}</p>
        </div>

        <!-- Conditions d'utilisation -->
        <label class="terms">
          <input type="checkbox" v-model="form.acceptTerms" required />
          J'accepte les
          <router-link to="/conditions">conditions d'utilisation</router-link>
        </label>

        <p v-if="generalError" class="general-error">{{ generalError }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Création du compte...' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="switch-auth">
        Déjà un compte ?
        <router-link :to="{ name: 'login' }">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  lastName: '',
  firstName: '',
  phone: '',
  email: '',
  city: '',
  password: '',
  passwordConfirm: '',
  acceptTerms: false,
})

const errors = reactive({
  lastName: '',
  firstName: '',
  phone: '',
  email: '',
  city: '',
  password: '',
  passwordConfirm: '',
})

const generalError = ref('')
const loading = ref(false)

function validate() {
  Object.keys(errors).forEach((key) => (errors[key] = ''))
  let valid = true

  if (!form.lastName.trim()) {
    errors.lastName = 'Veuillez entrer votre nom.'
    valid = false
  }

  if (!form.firstName.trim()) {
    errors.firstName = 'Veuillez entrer votre prénom.'
    valid = false
  }

  if (!/^[0-9+ ]{8,15}$/.test(form.phone.trim())) {
    errors.phone = 'Numéro de téléphone invalide.'
    valid = false
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = 'Adresse email invalide.'
    valid = false
  }

  if (!form.city.trim()) {
    errors.city = 'Veuillez indiquer votre ville.'
    valid = false
  }

  if (form.password.length < 8) {
    errors.password = 'Le mot de passe doit contenir au moins 8 caractères.'
    valid = false
  }

  if (form.passwordConfirm !== form.password) {
    errors.passwordConfirm = 'Les mots de passe ne correspondent pas.'
    valid = false
  }

  return valid
}

async function handleRegister() {
  generalError.value = ''
  if (!validate()) return

  if (!form.acceptTerms) {
    generalError.value = "Veuillez accepter les conditions d'utilisation."
    return
  }

  loading.value = true
  try {
    auth.register({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
    })
    router.push('/')
  } catch (err) {
    generalError.value = "Une erreur est survenue. Veuillez réessayer."
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e8f2ec 0%, #f8f5eb 55%, #f1dfc6 100%);
  padding: 32px 20px;
}

.auth-card {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(31, 92, 76, 0.12);
  border-radius: 24px;
  padding: 38px 34px 30px;
  box-shadow: 0 24px 60px rgba(31, 92, 76, 0.14);
  backdrop-filter: blur(12px);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #1f5c4c;
  margin: 0 0 8px;
}

.subtitle {
  font-size: 14px;
  line-height: 1.5;
  color: #68756f;
  margin: 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.name-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 13px;
  font-weight: 600;
  color: #263d34;
}

input[type='text'],
input[type='tel'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid #d7e2da;
  border-radius: 12px;
  background: #fbfdfb;
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

input:focus {
  border-color: #1f5c4c;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(31, 92, 76, 0.1);
}

.error {
  color: #dc2626;
  font-size: 12px;
  margin: 0;
}

.general-error {
  color: #dc2626;
  font-size: 13px;
  text-align: center;
  background: #fef2f2;
  padding: 10px;
  border-radius: 8px;
  margin: 0;
}

.terms {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
}

.terms a {
  color: #0f4d3a;
  font-weight: 600;
  text-decoration: none;
}

.submit-btn {
  margin-top: 8px;
  padding: 14px;
  background: #1f5c4c;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.switch-auth {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  margin-top: 22px;
}

.switch-auth a {
  color: #1f5c4c;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 480px) {
  .auth-page { padding: 20px 14px; }
  .auth-card { padding: 30px 20px 24px; border-radius: 20px; }
  .name-fields { grid-template-columns: 1fr; gap: 15px; }
}
</style>