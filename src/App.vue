<template>
  <v-app>
    <v-app-bar color="primary" density="compact" dark>
      <v-app-bar-title>AgroView</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn v-for="item in menuItems" :key="item.title" :to="item.route" variant="text">
        <v-icon start>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer app color="primary" dark class="text-center">
      <div class="text-body-2">
        AgroView - Gerenciador de Plantações © {{ new Date().getFullYear() }}
      </div>
    </v-footer>
  </v-app>
</template>

<script setup>
const menuItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', route: '/' },
  { title: 'Plantações', icon: 'mdi-sprout', route: '/plantacoes' },
  { title: 'Nova Plantação', icon: 'mdi-plus-circle', route: '/cadastro' }
]
</script>