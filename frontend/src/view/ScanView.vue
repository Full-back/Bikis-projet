<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  analyzePrescription,
  compressPrescriptionImage,
  defaultPrescriptionLocation,
  findAvailablePharmacies,
  getBrowserLocation,
} from '../services/prescriptionMock'

const router = useRouter()
const step = ref('capture')
const cameraInput = ref(null)
const galleryInput = ref(null)
const selectedFile = ref(null)
const previewUrl = ref('')
const medicines = ref([])
const pharmacies = ref([])
const selectedPharmacy = ref(null)
const location = ref({ ...defaultPrescriptionLocation })
const isBusy = ref(false)
const errorMessage = ref('')
let nextMedicineId = 1

const completeCount = computed(() => medicines.value.length)

function releasePreview() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
}

function chooseImage(event) {
  const [file] = event.target.files ?? []
  event.target.value = ''
  if (!file) return

  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Choisissez un fichier image pour votre ordonnance.'
    return
  }

  releasePreview()
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  errorMessage.value = ''
  step.value = 'preview'
}

function retakePhoto() {
  releasePreview()
  selectedFile.value = null
  step.value = 'capture'
  cameraInput.value?.click()
}

async function analyzeImage() {
  if (!selectedFile.value || isBusy.value) return
  isBusy.value = true
  errorMessage.value = ''
  step.value = 'analyzing'

  try {
    const compressedImage = await compressPrescriptionImage(selectedFile.value)
    medicines.value = await analyzePrescription(compressedImage)
    nextMedicineId = medicines.value.length + 1
    step.value = 'medicines'
  } catch (error) {
    errorMessage.value = error.message || 'La photo n’a pas pu être analysée. Réessayez.'
    step.value = 'preview'
  } finally {
    isBusy.value = false
  }
}

function addMedicine() {
  medicines.value.push({
    id: `manual-${nextMedicineId++}`,
    name: '',
    dosage: '',
    form: '',
    quantity: 1,
  })
}

function removeMedicine(id) {
  medicines.value = medicines.value.filter((medicine) => medicine.id !== id)
}

async function searchPharmacies() {
  if (!medicines.value.length || isBusy.value) return
  isBusy.value = true
  errorMessage.value = ''
  step.value = 'pharmacy-loading'

  try {
    location.value = await getBrowserLocation()
    pharmacies.value = await findAvailablePharmacies(medicines.value, location.value)
    step.value = 'pharmacies'
  } catch {
    errorMessage.value = 'La recherche de pharmacies a échoué. Réessayez.'
    step.value = 'medicines'
  } finally {
    isBusy.value = false
  }
}

function requestReservation(pharmacy) {
  selectedPharmacy.value = pharmacy
  const query = {
    pharmacy: pharmacy.name,
    medicines: JSON.stringify(medicines.value),
    price: String(pharmacy.totalPrice),
    complete: String(pharmacy.availableCount === pharmacy.totalCount),
    availableCount: String(pharmacy.availableCount),
    totalCount: String(pharmacy.totalCount),
  }
  router.push({ name: 'reservation-confirm', query })
}

function restartScan() {
  releasePreview()
  selectedFile.value = null
  medicines.value = []
  pharmacies.value = []
  errorMessage.value = ''
  step.value = 'capture'
}

function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR').format(price)
}

onBeforeUnmount(releasePreview)
</script>

<template>
  <main class="prescription-flow">
    <header class="flow-header">
      <button class="icon-button" type="button" aria-label="Retour à l’accueil" @click="router.push({ name: 'home' })">←</button>
      <div><p class="eyebrow">Bikis · Ordonnance</p><h1>Scanner une ordonnance</h1></div>
    </header>

    <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>

    <section v-if="step === 'capture'" class="capture-panel">
      <div class="document-mark" aria-hidden="true"><span>Rx</span><i></i><i></i><i></i></div>
      <h2>Votre ordonnance, en un instant</h2>
      <p>Photographiez-la ou choisissez une image nette depuis votre galerie.</p>
      <input ref="cameraInput" class="visually-hidden" type="file" accept="image/*" capture="environment" @change="chooseImage" />
      <input ref="galleryInput" class="visually-hidden" type="file" accept="image/*" @change="chooseImage" />
      <button class="primary-button capture-action" type="button" @click="cameraInput?.click()">
        <span aria-hidden="true">⌾</span> Prendre en photo mon ordonnance
      </button>
      <button class="secondary-button" type="button" @click="galleryInput?.click()">Importer depuis la galerie</button>
      <small class="privacy-note">Votre image reste sur cet appareil pendant cette démonstration.</small>
    </section>

    <section v-else-if="step === 'preview'" class="preview-panel">
      <img class="prescription-preview" :src="previewUrl" alt="Aperçu de l’ordonnance sélectionnée" />
      <div class="preview-actions">
        <button class="secondary-button" type="button" @click="retakePhoto">Reprendre</button>
        <button class="primary-button" type="button" @click="analyzeImage">Analyser</button>
      </div>
    </section>

    <section v-else-if="step === 'analyzing' || step === 'pharmacy-loading'" class="loading-panel" aria-live="polite">
      <div class="loading-orbit" aria-hidden="true"><span></span><span></span><span></span></div>
      <h2>{{ step === 'analyzing' ? 'Lecture de votre ordonnance…' : 'Recherche des pharmacies…' }}</h2>
      <p>{{ step === 'analyzing' ? 'Nous préparons la liste de vos médicaments.' : 'Nous comparons les disponibilités autour de vous.' }}</p>
    </section>

    <section v-else-if="step === 'medicines'" class="medicines-panel">
      <div class="section-heading"><p class="eyebrow">Étape 1 sur 2</p><h2>Médicaments détectés</h2></div>
      <p class="helper-text">Vérifiez que la liste correspond bien à votre ordonnance.</p>

      <div v-if="medicines.length" class="medicine-list">
        <article v-for="medicine in medicines" :key="medicine.id" class="medicine-row">
          <div class="medicine-fields">
            <label>Nom<input v-model.trim="medicine.name" placeholder="Nom du médicament" /></label>
            <div class="field-pair">
              <label>Dosage<input v-model.trim="medicine.dosage" placeholder="Ex. 500 mg" /></label>
              <label>Forme<input v-model.trim="medicine.form" placeholder="Ex. Gélule" /></label>
            </div>
            <label>Quantité<input v-model.number="medicine.quantity" type="number" min="1" inputmode="numeric" /></label>
          </div>
          <button class="remove-button" type="button" :aria-label="`Supprimer ${medicine.name || 'ce médicament'}`" @click="removeMedicine(medicine.id)">×</button>
        </article>
      </div>
      <p v-else class="empty-list">Ajoutez les médicaments inscrits sur votre ordonnance.</p>

      <button class="add-button" type="button" @click="addMedicine"><span aria-hidden="true">+</span> Ajouter un médicament</button>
      <button class="primary-button sticky-action" type="button" :disabled="!medicines.length || medicines.some((medicine) => !medicine.name)" @click="searchPharmacies">Vérifier en pharmacie</button>
    </section>

    <section v-else-if="step === 'pharmacies'" class="pharmacies-panel">
      <div class="section-heading"><p class="eyebrow">Étape 2 sur 2</p><h2>Pharmacies disponibles</h2></div>
      <p class="helper-text">{{ location.isFallback ? 'Résultats autour de Brazzaville.' : 'Résultats autour de votre position.' }}</p>
      <div class="pharmacy-list">
        <article v-for="pharmacy in pharmacies" :key="pharmacy.id" class="pharmacy-card">
          <div class="pharmacy-card__top">
            <div><h3>{{ pharmacy.name }}</h3><p>{{ pharmacy.distance.toFixed(1) }} km</p></div>
            <span class="availability-badge" :class="pharmacy.availableCount === completeCount ? 'availability-badge--complete' : 'availability-badge--partial'">
              {{ pharmacy.availableCount }} sur {{ pharmacy.totalCount }}
            </span>
          </div>
          <div class="pharmacy-card__bottom">
            <p>Prix total <strong>{{ formatPrice(pharmacy.totalPrice) }} FCFA</strong></p>
            <button class="primary-button reserve-button" type="button" @click="requestReservation(pharmacy)">Demander</button>
          </div>
        </article>
      </div>
      <button class="text-button" type="button" @click="step = 'medicines'">← Modifier les médicaments</button>
    </section>
  </main>
</template>

<style scoped>
.prescription-flow { min-height: 100svh; padding: 18px 18px calc(28px + env(safe-area-inset-bottom)); background: #f5f7f3; color: #1c2923; }
.flow-header { display: flex; align-items: center; gap: 12px; width: min(100%, 720px); margin: 0 auto 28px; }
.icon-button { display: grid; flex: 0 0 42px; height: 42px; place-items: center; border: 1px solid #dce5dc; border-radius: 12px; background: white; color: #1f5c4c; font-size: 23px; cursor: pointer; }
.eyebrow { margin: 0 0 4px; color: #5b7869; font-size: 11px; font-weight: 800; }
h1, h2, h3, p { margin-top: 0; }
.flow-header h1 { margin-bottom: 0; font-size: 20px; font-weight: 800; letter-spacing: 0; }
.capture-panel, .preview-panel, .loading-panel, .medicines-panel, .pharmacies-panel { width: min(100%, 620px); margin: 0 auto; }
.capture-panel { display: flex; min-height: min(66vh, 560px); flex-direction: column; align-items: center; justify-content: center; padding: 30px 22px; border: 1px solid #e0e8df; border-radius: 18px; background: #fff; text-align: center; }
.document-mark { display: flex; width: 92px; height: 118px; flex-direction: column; justify-content: center; gap: 10px; margin-bottom: 26px; padding: 13px; transform: rotate(-3deg); border: 1px solid #d6e4d8; border-radius: 7px; background: linear-gradient(150deg, #f7fcf7, #e4f1e6); box-shadow: 0 12px 26px rgb(31 92 76 / 12%); }
.document-mark span { color: #1f5c4c; font-family: Georgia, serif; font-size: 24px; font-weight: 700; text-align: left; }
.document-mark i { width: 100%; height: 3px; border-radius: 2px; background: #bed3c3; }
.document-mark i:last-child { width: 68%; }
.capture-panel h2 { margin-bottom: 8px; font-size: 21px; font-weight: 800; letter-spacing: 0; }
.capture-panel > p, .loading-panel p { max-width: 360px; margin-bottom: 24px; color: #68766d; font-size: 14px; line-height: 1.5; }
.primary-button, .secondary-button { display: inline-flex; min-height: 48px; align-items: center; justify-content: center; gap: 8px; padding: 12px 16px; border: 0; border-radius: 10px; font: inherit; font-size: 14px; font-weight: 800; cursor: pointer; }
.primary-button { background: #1f5c4c; color: #fff; }
.primary-button:disabled { background: #a9b9ae; cursor: not-allowed; }
.secondary-button { border: 1px solid #d6e3d8; background: #fff; color: #1f5c4c; }
.capture-action, .capture-panel > .secondary-button { width: 100%; max-width: 380px; }
.capture-panel > .secondary-button { margin-top: 10px; }
.capture-action span { font-size: 20px; }
.privacy-note { margin-top: 20px; color: #7a877f; font-size: 11px; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; clip-path: inset(50%); }
.preview-panel { padding: 14px; border: 1px solid #e0e8df; border-radius: 16px; background: white; }
.prescription-preview { display: block; width: 100%; max-height: 68svh; border-radius: 10px; object-fit: contain; background: #edf0ec; }
.preview-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 14px; }
.loading-panel { display: grid; min-height: 60svh; place-content: center; justify-items: center; padding: 24px; text-align: center; }
.loading-panel h2 { margin: 25px 0 7px; font-size: 21px; font-weight: 800; letter-spacing: 0; }
.loading-orbit { position: relative; display: grid; width: 74px; height: 74px; place-items: center; border: 2px solid #dbe9de; border-radius: 50%; }
.loading-orbit::before { position: absolute; inset: 8px; border: 2px solid transparent; border-top-color: #1f5c4c; border-radius: 50%; animation: spin 900ms linear infinite; content: ''; }
.loading-orbit span { position: absolute; width: 7px; height: 7px; border-radius: 50%; background: #e8a33d; animation: pulse 1s ease-in-out infinite alternate; }
.loading-orbit span:nth-child(2) { transform: translateX(-13px); animation-delay: 160ms; }
.loading-orbit span:nth-child(3) { transform: translateX(13px); animation-delay: 320ms; }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { to { opacity: .25; transform: scale(.6); } }
.section-heading h2 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 0; }
.helper-text { margin: 8px 0 18px; color: #68766d; font-size: 13px; }
.medicine-list, .pharmacy-list { display: grid; gap: 12px; }
.medicine-row, .pharmacy-card { border: 1px solid #e0e8df; border-radius: 13px; background: #fff; }
.medicine-row { display: grid; grid-template-columns: minmax(0, 1fr) 34px; gap: 8px; padding: 14px; }
.medicine-fields { display: grid; gap: 11px; }
.medicine-fields label { display: grid; gap: 5px; color: #607168; font-size: 11px; font-weight: 700; }
.medicine-fields input { width: 100%; min-width: 0; height: 40px; padding: 0 10px; border: 1px solid #dce5dc; border-radius: 8px; background: #fcfdfb; color: #1c2923; font: inherit; font-size: 13px; }
.field-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.remove-button { display: grid; width: 34px; height: 34px; place-items: center; border: 0; border-radius: 8px; background: #f8ece9; color: #a64135; font-size: 23px; cursor: pointer; }
.add-button, .text-button { display: flex; align-items: center; gap: 7px; padding: 12px 0; border: 0; background: transparent; color: #1f5c4c; font: inherit; font-size: 13px; font-weight: 800; cursor: pointer; }
.add-button span { font-size: 20px; }
.empty-list { padding: 20px; border: 1px dashed #bdcfc0; border-radius: 12px; color: #68766d; font-size: 13px; text-align: center; }
.sticky-action { position: sticky; bottom: 12px; width: 100%; margin-top: 18px; box-shadow: 0 8px 25px rgb(26 60 43 / 18%); }
.pharmacy-card { padding: 16px; }
.pharmacy-card__top, .pharmacy-card__bottom { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.pharmacy-card h3 { margin-bottom: 5px; font-size: 15px; }
.pharmacy-card__top p, .pharmacy-card__bottom p { margin: 0; color: #68766d; font-size: 12px; }
.availability-badge { flex: 0 0 auto; padding: 6px 9px; border-radius: 999px; font-size: 11px; font-weight: 800; }
.availability-badge--complete { background: #e0f2e4; color: #287044; }
.availability-badge--partial { background: #fff0d9; color: #945a09; }
.pharmacy-card__bottom { margin-top: 15px; padding-top: 13px; border-top: 1px solid #edf0ec; }
.pharmacy-card__bottom strong { display: block; margin-top: 4px; color: #1c2923; font-size: 15px; }
.reserve-button { min-height: 40px; padding: 9px 16px; font-size: 12px; }
.text-button { margin: 8px auto 0; }
.error-message { width: min(100%, 620px); margin: 0 auto 16px; padding: 11px 13px; border: 1px solid #efcbc3; border-radius: 9px; background: #fff1ee; color: #9a392e; font-size: 13px; }
@media (min-width: 760px) {
  .prescription-flow { padding-top: 30px; }
  .capture-panel { min-height: 540px; }
  .medicine-list { grid-template-columns: 1fr 1fr; }
  .sticky-action { position: static; }
}
</style>