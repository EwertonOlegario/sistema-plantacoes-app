<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Dashboard</h1>
      </v-col>
    </v-row>
    
    <v-row v-if="!plantacoes.length">
      <v-col cols="12">
        <v-alert type="info">
          Nenhuma plantação cadastrada ainda. 
          <v-btn to="/cadastro" color="primary" class="ms-2">
            Cadastrar Plantação
          </v-btn>
        </v-alert>
      </v-col>
    </v-row>
    
    <template v-else>
      <!-- Cards de resumo -->
      <v-row>
        <v-col cols="12" md="4">
          <v-card color="primary" dark>
            <v-card-item>
              <v-card-title>Total de Plantações</v-card-title>
              <div class="text-h2 text-center my-4">{{ plantacoes.length }}</div>
            </v-card-item>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card color="secondary" dark>
            <v-card-item>
              <v-card-title>Área Total</v-card-title>
              <div class="text-h2 text-center my-4">{{ totalArea }} ha</div>
            </v-card-item>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="4">
          <v-card color="accent" dark>
            <v-card-item>
              <v-card-title>Rendimento Médio</v-card-title>
              <div class="text-h2 text-center my-4">{{ rendimentoMedio }} ton/ha</div>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Distribuição de culturas -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Distribuição por Cultura</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <v-card outlined class="text-center" color="yellow lighten-5">
                    <v-card-title class="text-h6">Milho 🌽</v-card-title>
                    <v-card-text class="text-h4">{{ distribuicaoCulturas.milho }}</v-card-text>
                    <v-card-text>{{ percentualMilho }}% das plantações</v-card-text>
                  </v-card>
                </v-col>
                
                <v-col cols="6">
                  <v-card outlined class="text-center" color="green lighten-5">
                    <v-card-title class="text-h6">Soja 🌱</v-card-title>
                    <v-card-text class="text-h4">{{ distribuicaoCulturas.soja }}</v-card-text>
                    <v-card-text>{{ percentualSoja }}% das plantações</v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Distribuição por Status</v-card-title>
            <v-card-text>
              <div v-for="(qtd, status) in distribuicaoStatus" :key="status">
                <div class="d-flex justify-space-between align-center mb-2">
                  <div class="d-flex align-center">
                    <tag-status :status="status" />
                  </div>
                  <span>{{ qtd }} plantação(ões)</span>
                </div>
                
                <v-progress-linear
                  :value="(qtd / plantacoes.length) * 100"
                  :color="getStatusColor(status)"
                  height="10"
                  class="mb-3"
                ></v-progress-linear>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Plantações recentes -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title>Plantações Recentes</v-card-title>
            <v-card-text>
              <v-list lines="two">
                <v-list-item 
                  v-for="plantacao in plantacoesRecentes" 
                  :key="plantacao.id"
                  :to="`/plantacao/${plantacao.id}`"
                >
                  <v-list-item-title>{{ plantacao.nome }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ plantacao.cultura === 'milho' ? 'Milho 🌽' : 'Soja 🌱' }} | 
                    {{ plantacao.area }} {{ plantacao.unidade }} | 
                    Plantio: {{ formatarData(plantacao.dataPlantio) }}
                  </v-list-item-subtitle>
                  
                  <template v-slot:append>
                    <tag-status :status="plantacao.status" />
                  </template>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { plantacoesStore } from '../store/plantacoes'
import TagStatus from '../components/TagStatus.vue'

const plantacoes = ref([])

onMounted(() => {
  try {
    plantacoes.value = plantacoesStore.getPlantacoes()
    console.log('Plantações carregadas:', plantacoes.value)
  } catch (error) {
    console.error('Erro ao carregar plantações:', error)
  }
})

// Calcula métricas para o dashboard
const totalArea = computed(() => {
  return plantacoes.value.reduce((total, p) => {
    // Converter alqueires para hectares se necessário
    const area = p.unidade === 'alqueires' ? p.area * 2.42 : p.area
    return total + area
  }, 0).toFixed(1)
})

const rendimentoMedio = computed(() => {
  const plantacoesComRendimento = plantacoes.value.filter(p => 
    p.rendimentoEstimado !== null && 
    p.rendimentoEstimado !== undefined && 
    !isNaN(Number(p.rendimentoEstimado))
  )
  
  if (plantacoesComRendimento.length === 0) return 0
  
  const somaRendimentos = plantacoesComRendimento.reduce((total, p) => {
    return total + (Number(p.rendimentoEstimado) || 0)
  }, 0)

  return (somaRendimentos / plantacoesComRendimento.length).toFixed(1)
})

// Distribuição por cultura
const distribuicaoCulturas = computed(() => {
  return {
    milho: plantacoes.value.filter(p => p.cultura === 'milho').length,
    soja: plantacoes.value.filter(p => p.cultura === 'soja').length
  }
})

const percentualMilho = computed(() => {
  if (plantacoes.value.length === 0) return 0
  return ((distribuicaoCulturas.value.milho / plantacoes.value.length) * 100).toFixed(0)
})

const percentualSoja = computed(() => {
  if (plantacoes.value.length === 0) return 0
  return ((distribuicaoCulturas.value.soja / plantacoes.value.length) * 100).toFixed(0)
})

// Distribuição por status
const distribuicaoStatus = computed(() => {
  const result = {
    plantado: 0,
    crescimento: 0,
    colhido: 0
  }
  
  plantacoes.value.forEach(p => {
    if (result[p.status] !== undefined) {
      result[p.status]++
    }
  })
  
  return result
})

// Formata a data para exibição
const formatarData = (data) => {
  if (!data) return 'Data não informada'
  
  const dataObj = new Date(data)
  return dataObj.toLocaleDateString('pt-BR')
}

// Retorna as 5 plantações mais recentes por data de plantio
const plantacoesRecentes = computed(() => {
  return [...plantacoes.value]
    .sort((a, b) => new Date(b.dataPlantio) - new Date(a.dataPlantio))
    .slice(0, 5)
})

// Retorna a cor baseada no status
const getStatusColor = (status) => {
  const colors = {
    plantado: 'info',
    crescimento: 'success',
    colhido: 'primary'
  }
  
  return colors[status] || 'grey'
}
</script>