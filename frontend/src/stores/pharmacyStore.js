import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePharmacyStore = defineStore('pharmacy', () => {
  const search = ref('')
  const pharmacies = ref([{ name: 'Pharmacie de la Paix', distance: '1,2 km', price: '3 500 FCFA', available: true }, { name: 'Pharmacie Centrale', distance: '2,4 km', price: '3 750 FCFA', available: true }])
  return { search, pharmacies }
})