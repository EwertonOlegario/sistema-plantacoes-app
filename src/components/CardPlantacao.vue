<template>
  <v-card class="mx-auto mb-4" elevation="2" :color="cardColor">
    <v-card-item>
      <v-card-title>{{ plantacao.nome }}</v-card-title>
      <v-card-subtitle>
        Cultura: {{ plantacao.cultura === 'milho' ? 'Milho 🌽' : 'Soja 🌱' }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-map-marker" class="me-1"></v-icon>
        <span>{{ plantacao.localizacao }}</span>
      </div>
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-calendar" class="me-1"></v-icon>
        <span>Plantio: {{ formatarData(plantacao.dataPlantio) }}</span>
      </div>
      <div class="d-flex align-center mb-2">
        <v-icon icon="mdi-resize" class="me-1"></v-icon>
        <span>{{ plantacao.area }} {{ plantacao.unidade }}</span>
      </div>
      
      <tag-status :status="plantacao.status" />
    </v-card-text>

    <v-card-actions>
      <v-btn 
        variant="outlined" 
        size="small"
        :to="`/plantacao/${plantacao.id}`"
        color="black"
      >
        Ver detalhes
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { computed } from 'vue'
import TagStatus from './TagStatus.vue'

const props = defineProps({
  plantacao: {
    type: Object,
    required: true
  }
})

// Formata a data de plantio para exibição
const formatarData = (data) => {
  if (!data) return 'Data não informada'
  
  const dataObj = new Date(data)
  return dataObj.toLocaleDateString('pt-BR')
}

// Define cor do cartão com base na cultura
const cardColor = computed(() => {
  return props.plantacao.cultura === 'milho' 
    ? 'yellow lighten-5' 
    : 'green lighten-5'
})
</script>