<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import SplashScreen from './view/SplashScreen.vue'

const router = useRouter()
const showSplash = ref(true)

function finishSplash() {
  showSplash.value = false
  if (router.currentRoute.value.name !== 'home') {
    router.replace({ name: 'home' })
  }
}
</script>

<template>
  <SplashScreen v-if="showSplash" @finish="finishSplash" />
  <RouterView v-else />
</template>
