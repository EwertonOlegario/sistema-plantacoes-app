<template>
  <v-chip
    :color="statusConfig.color"
    variant="outlined"
    class="mt-2"
    size="small"
  >
    <v-icon start :icon="statusConfig.icon"></v-icon>
    {{ statusConfig.label }}
  </v-chip>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['plantado', 'crescimento', 'colhido'].includes(value)
  }
})

// Configuração do status (cor, ícone e label)
const statusConfig = computed(() => {
  const configs = {
    plantado: {
      color: 'black',
      icon: 'mdi-seed',
      label: 'Plantado'
    },
    crescimento: {
      color: 'black',
      icon: 'mdi-sprout',
      label: 'Em crescimento'
    },
    colhido: {
      color: 'black',
      icon: 'mdi-basket',
      label: 'Colhido'
    }
  }
  
  return configs[props.status] || configs.plantado
})
</script>