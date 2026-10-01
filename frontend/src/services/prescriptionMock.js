const brazzaville = { latitude: -4.2634, longitude: 15.2429 }

const mockMedicines = [
  { id: 'amoxicilline', name: 'Amoxicilline', dosage: '500 mg', form: 'Gélule', quantity: 1 },
  { id: 'paracetamol', name: 'Paracétamol', dosage: '1 g', form: 'Comprimé', quantity: 1 },
  { id: 'vitamine-c', name: 'Vitamine C', dosage: '500 mg', form: 'Comprimé', quantity: 1 },
]

const mockPharmacies = [
  {
    id: 'jagger',
    name: 'Pharmacie Jagger',
    latitude: -4.2581,
    longitude: 15.2514,
    totalPrice: 12500,
    availableMedicineIds: ['amoxicilline', 'paracetamol', 'vitamine-c'],
  },
  {
    id: 'marvray',
    name: 'Pharmacie Marvray',
    latitude: -4.2748,
    longitude: 15.2312,
    totalPrice: 8900,
    availableMedicineIds: ['amoxicilline', 'paracetamol'],
  },
  {
    id: 'btm',
    name: 'Pharmacie BTM',
    latitude: -4.2472,
    longitude: 15.2261,
    totalPrice: 5200,
    availableMedicineIds: ['amoxicilline'],
  },
]

function delay(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

export async function compressPrescriptionImage(file) {
  const image = typeof createImageBitmap === 'function'
    ? await createImageBitmap(file)
    : await new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file)
      const element = new Image()
      element.onload = () => {
        URL.revokeObjectURL(objectUrl)
        resolve({ width: element.naturalWidth, height: element.naturalHeight, source: element, close() {} })
      }
      element.onerror = () => {
        URL.revokeObjectURL(objectUrl)
        reject(new Error('Impossible de lire cette image.'))
      }
      element.src = objectUrl
    })
  const scale = Math.min(1, 1600 / image.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)

  const context = canvas.getContext('2d')
  if (!context) {
    image.close()
    throw new Error('Impossible de préparer la photo sur cet appareil.')
  }

  context.drawImage(image.source ?? image, 0, 0, canvas.width, canvas.height)
  image.close()

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) resolve(result)
      else reject(new Error('La compression de la photo a échoué.'))
    }, 'image/jpeg', 0.8)
  })

  return new File([blob], 'ordonnance.jpg', { type: 'image/jpeg' })
}

export async function analyzePrescription(_compressedImage) {
  await delay(2000)
  return mockMedicines.map((medicine) => ({ ...medicine }))
}

export function getBrowserLocation() {
  if (!navigator.geolocation) return Promise.resolve({ ...brazzaville, isFallback: true })

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve({ latitude: coords.latitude, longitude: coords.longitude, isFallback: false }),
      () => resolve({ ...brazzaville, isFallback: true }),
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 300000 },
    )
  })
}

function distanceInKilometers(origin, destination) {
  const radians = (degrees) => (degrees * Math.PI) / 180
  const latitudeDifference = radians(destination.latitude - origin.latitude)
  const longitudeDifference = radians(destination.longitude - origin.longitude)
  const arc = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(radians(origin.latitude))
    * Math.cos(radians(destination.latitude))
    * Math.sin(longitudeDifference / 2) ** 2

  return 6371 * 2 * Math.atan2(Math.sqrt(arc), Math.sqrt(1 - arc))
}

export async function findAvailablePharmacies(medicines, location) {
  await delay(1200)

  return mockPharmacies
    .map((pharmacy) => {
      const availableCount = medicines.filter((medicine) => pharmacy.availableMedicineIds.includes(medicine.id)).length
      return {
        id: pharmacy.id,
        name: pharmacy.name,
        totalPrice: pharmacy.totalPrice,
        availableCount,
        totalCount: medicines.length,
        distance: distanceInKilometers(location, pharmacy),
      }
    })
    .sort((first, second) => (
      Number(second.availableCount === second.totalCount) - Number(first.availableCount === first.totalCount)
      || second.availableCount - first.availableCount
      || first.distance - second.distance
    ))
}

export const defaultPrescriptionLocation = brazzaville