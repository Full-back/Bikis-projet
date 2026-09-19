<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Gestion des étapes : 'scan', 'analyzing', 'results'
const currentStep = ref('scan')
const isFlashOn = ref(false)
const fileInput = ref(null)
const videoElement = ref(null)
const previewUrl = ref('')
const cameraError = ref('')
const isCameraReady = ref(false)
let cameraStream = null

// Données simulées après l'analyse de l'ordonnance
const detectedMedicaments = ref([
  { id: 1, nom: 'Amoxicilline 500mg', posologie: '2 comprimés, 3 fois par jour pendant 7 jours', type: 'Antibiotique' },
  { id: 2, nom: 'Paracétamol 1g', posologie: '1 comprimé si besoin', type: 'Antalgique' },
  { id: 3, nom: 'Vitamine C 500mg', posologie: '1 comprimé par jour pendant 10 jours', type: 'Complément' }
])

async function startCamera() {
  cameraError.value = ''

  if (!navigator.mediaDevices?.getUserMedia) {
    cameraError.value = 'La caméra nécessite HTTPS ou localhost. Utilisez la galerie.'
    return
  }

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false,
    })
    videoElement.value.srcObject = cameraStream
    await videoElement.value.play()
    isCameraReady.value = true
  } catch (error) {
    cameraError.value = error.name === 'NotAllowedError'
      ? 'Autorisez l’accès à la caméra dans votre navigateur, puis réessayez.'
      : 'Impossible d’ouvrir la caméra. Vous pouvez choisir une photo dans la galerie.'
  }
}

function stopCamera() {
  cameraStream?.getTracks().forEach((track) => track.stop())
  cameraStream = null
  isCameraReady.value = false
}

function handleImage(file) {
  if (!file?.type.startsWith('image/')) return

  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
  stopCamera()
}

function handleFileChange(event) {
  handleImage(event.target.files?.[0])
}

function triggerCapture() {
  if (!isCameraReady.value) {
    startCamera()
    return
  }

  const canvas = document.createElement('canvas')
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  canvas.getContext('2d').drawImage(videoElement.value, 0, 0)
  canvas.toBlob((blob) => handleImage(new File([blob], 'ordonnance.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.92)
}

async function toggleFlash() {
  isFlashOn.value = !isFlashOn.value
  const track = cameraStream?.getVideoTracks()[0]
  if (!track?.applyConstraints) return

  try {
    await track.applyConstraints({ advanced: [{ torch: isFlashOn.value }] })
  } catch {
    cameraError.value = 'Le flash n’est pas disponible sur cet appareil.'
  }
}

function analyzeImage() {
  stopCamera()
  currentStep.value = 'analyzing'
  setTimeout(() => {
    currentStep.value = 'results'
  }, 1500) // Petit délai pour simuler l'intelligence artificielle qui analyse l'ordonnance
}

function resetScan() {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''
  cameraError.value = ''
  currentStep.value = 'scan'
  startCamera()
}

onMounted(startCamera)
onBeforeUnmount(() => {
  stopCamera()
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<template>
  <main class="scanner-flow">
    
    <!-- ÉTAPE 1 : LE SCANNER -->
    <section v-if="currentStep === 'scan'" class="scan-view">
      <div class="stepper">
        <span class="step-badge step-badge--active">1</span>
        <span class="step-label">Scan</span>
        <span class="step-divider"></span>
        <span class="step-badge">2</span>
        <span class="step-label">Analyse</span>
        <span class="step-divider"></span>
        <span class="step-badge">3</span>
        <span class="step-label">Résultats</span>
        <span class="step-divider"></span>
        <span class="step-badge">4</span>
        <span class="step-label">Pharmacies</span>
      </div>

      <p class="scan-instruction">Prenez une photo nette de votre ordonnance</p>

      <!-- Viseur de l'appareil photo -->
      <div class="camera-viewfinder">
        <video ref="videoElement" class="camera-video" autoplay playsinline muted></video>
        <img v-if="previewUrl" class="captured-preview" :src="previewUrl" alt="Photo de l’ordonnance" />
        <div v-if="!isCameraReady && !previewUrl" class="paper-preview">
          <span class="rx-logo">Rx</span>
          <div class="line"></div>
          <div class="line short"></div>
          <div class="line"></div>
        </div>
      </div>

      <p v-if="cameraError" class="camera-message camera-message--error">{{ cameraError }}</p>
      <button v-if="!isCameraReady && !previewUrl" class="camera-start-btn" type="button" @click="startCamera">
        Autoriser la caméra
      </button>
      <button v-if="previewUrl" class="camera-start-btn" type="button" @click="analyzeImage">
        Utiliser cette photo
      </button>

      <!-- Contrôles de la caméra -->
      <div class="camera-controls">
        <button class="control-btn" type="button" @click="fileInput?.click()">
          <span>🖼️</span>
          <small>Galerie</small>
        </button>
        <button class="capture-btn" type="button" @click="triggerCapture" aria-label="Prendre la photo"></button>
        <button class="control-btn" type="button" @click="toggleFlash">
          <span>⚡</span>
          <small>Flash</small>
        </button>
        <input ref="fileInput" type="file" accept="image/*" capture="environment" class="file-input" @change="handleFileChange" />
      </div>

      <div class="scan-tips">
        <p>✓ Assurez-vous que le texte est lisible</p>
        <p>✓ Évitez les ombres et reflets</p>
      </div>
    </section>

    <!-- ÉTAPE INTERMÉDIAIRE : ANALYSE EN COURS -->
    <section v-else-if="currentStep === 'analyzing'" class="analyzing-view">
      <div class="loader-spinner"></div>
      <h2>Analyse de l'ordonnance en cours...</h2>
      <p>Extraction des médicaments et des posologies par l'IA...</p>
    </section>

    <!-- ÉTAPE 2 & 3 : RÉSULTATS DE L'ANALYSE -->
    <section v-else-if="currentStep === 'results'" class="results-view">
      <header class="results-header">
        <button class="back-btn" @click="resetScan">←</button>
        <h2>Résultats de l'analyse</h2>
      </header>

      <div class="success-banner">
        <span>✅</span>
        <div>
          <strong>Ordonnance analysée avec succès</strong>
          <p>{{ detectedMedicaments.length }} médicaments détectés</p>
        </div>
      </div>

      <h3>Médicaments détectés</h3>
      
      <div class="medicament-list">
        <article v-for="med in detectedMedicaments" :key="med.id" class="medicament-card">
          <div class="med-icon">📄</div>
          <div class="med-info">
            <h4>{{ med.nom }}</h4>
            <p>{{ med.posologie }}</p>
          </div>
          <span class="med-badge">{{ med.type }}</span>
        </article>
      </div>

      <div class="action-buttons">
        <button class="btn-primary">Trouver les meilleures pharmacies</button>
        <button class="btn-secondary">Enregistrer dans mes ordonnances</button>
      </div>
    </section>

  </main>
</template>

<style scoped>
.scanner-flow {
  max-width: 480px;
  margin: 0 auto;
  padding: 20px;
  font-family: inherit;
}

/* Stepper */
.stepper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 11px;
  color: #6b7570;
}
.step-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e2e8e4;
  display: grid;
  place-items: center;
  font-weight: bold;
}
.step-badge--active {
  background: #087946;
  color: white;
}
.step-divider {
  flex: 1;
  height: 2px;
  background: #e2e8e4;
  margin: 0 6px;
}

.scan-instruction {
  text-align: center;
  font-weight: 600;
  margin-bottom: 15px;
}

/* Viseur appareil photo */
.camera-viewfinder {
  position: relative;
  height: 380px;
  background: #2a2421;
  border-radius: 20px;
  display: grid;
  place-items: center;
  border: 3px solid #35c77c;
  overflow: hidden;
  margin-bottom: 20px;
}
.camera-video,
.captured-preview {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.camera-video { background: #171b19; }
.camera-message {
  margin: -8px 0 12px;
  text-align: center;
  font-size: 12px;
}
.camera-message--error { color: #a33a32; }
.camera-start-btn {
  display: block;
  width: 100%;
  margin: -8px 0 16px;
  padding: 11px 14px;
  border: 1px solid #087946;
  border-radius: 10px;
  background: #e6f4ed;
  color: #087946;
  font-weight: 700;
  cursor: pointer;
}
.paper-preview {
  width: 200px;
  height: 280px;
  background: #fdfbf7;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}
.rx-logo { font-family: serif; font-weight: bold; font-size: 20px; }
.line { height: 4px; background: #ddd; margin: 10px 0; border-radius: 2px; }
.line.short { width: 60%; }

/* Contrôles bas de l'appareil */
.camera-controls {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 20px;
}
.capture-btn {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background: #087946;
  border: 4px solid #fff;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
  cursor: pointer;
}
.control-btn {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  color: #555;
  font-size: 12px;
}
.control-btn span { font-size: 20px; }
.file-input { display: none; }

.scan-tips {
  background: #f4f1e8;
  padding: 12px;
  border-radius: 10px;
  font-size: 11px;
  color: #444;
  display: grid;
  gap: 4px;
}

/* Écran de résultats */
.results-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.back-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.success-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #e6f4ed;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 20px;
  color: #087946;
}
.medicament-list {
  display: grid;
  gap: 10px;
  margin-bottom: 25px;
}
.medicament-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #e2e8e4;
}
.med-icon {
  font-size: 20px;
  background: #e6f4ed;
  padding: 8px;
  border-radius: 8px;
}
.med-info { flex: 1; }
.med-info h4 { margin: 0 0 2px; font-size: 13px; }
.med-info p { margin: 0; font-size: 11px; color: #6b7570; }
.med-badge {
  font-size: 10px;
  background: #fff3e0;
  color: #b7791f;
  padding: 4px 8px;
  border-radius: 999px;
  font-weight: bold;
}
.action-buttons {
  display: grid;
  gap: 10px;
}
.btn-primary {
  background: #087946;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}
.btn-secondary {
  background: transparent;
  color: #087946;
  border: 1px solid #087946;
  padding: 14px;
  border-radius: 12px;
  font-weight: bold;
  cursor: pointer;
}
</style>