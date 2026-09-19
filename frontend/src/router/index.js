import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('../view/HomeView.vue') },
    { path: '/scan', name: 'scan', component: () => import('../view/ScanView.vue') },
    { path: '/results', name: 'results', component: () => import('../view/ResultsView.vue') },
    { path: '/pharmacies', name: 'pharmacies', component: () => import('../view/PharmacyListView.vue') },
    { path: '/pharmacies/:id', name: 'pharmacy-detail', component: () => import('../view/PharmacyDetailView.vue') },
    { path: '/prescriptions', name: 'prescriptions', component: () => import('../view/PrescriptionsView.vue') },
    { path: '/profile', name: 'profile', component: () => import('../view/ProfileView.vue') },
    { path: '/login', name: 'login', component: () => import('../view/LoginView.vue') },
    { path: '/register', name: 'register', component: () => import('../view/RegisterView.vue') },
    { path: '/tracking', name: 'tracking', component: () => import('../view/TrackingView.vue') },
    { path: '/messages', name: 'messages', component: () => import('../view/MessagesView.vue') },
    { path: '/reservation/confirm', name: 'reservation-confirm', component: () => import('../view/ReservationConfirmView.vue') },
    { path: '/reminder', name: 'reminder', component: () => import('../view/ReminderView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../view/NotFoundView.vue') },
  ],
})

export default router
