<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center mb-4">
          <h1 class="text-h4">Lista de Plantações</h1>
          <v-btn color="primary" to="/cadastro" prepend-icon="mdi-plus">
            Nova Plantação
          </v-btn>
        </div>
      </v-col>
    </v-row>
    
    <!-- Filtros -->
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="filtros.cultura"
          :items="culturas"
          label="Filtrar por Cultura"
          clearable
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-select
          v-model="filtros.status"
          :items="statusOptions"
          label="Filtrar por Status"
          clearable
        ></v-select>
      </v-col>
      
      <v-col cols="12" md="4">
        <v-text-field
          v-model="filtros.busca"
          label="Buscar plantação"
          clearable
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
    </v-row>
    
    <!-- Exibe mensagem quando não há plantações -->
    <v-row v-if="!plantacoes.length">
      <v-col cols="12">
        <v-alert type="info">
          Nenhuma plantação cadastrada ainda.
        </v-alert>
      </v-col>
    </v-row>
    
    <!-- Exibe mensagem quando nenhuma plantação corresponde aos filtros -->
    <v-row v-else-if="!plantacoesFiltradas.length">
      <v-col cols="12">
        <v-alert type="warning">
          Nenhuma plantação corresponde aos filtros selecionados.
          <v-btn text @click="limparFiltros" color="primary">Limpar Filtros</v-btn>
        </v-alert>
      </v-col>
    </v-row>
    
    <!-- Lista de plantações -->
    <v-row v-else>
      <v-col 
        v-for="plantacao in plantacoesFiltradas" 
        :key="plantacao.id"
        cols="12" md="6" lg="4"
      >
        <card-plantacao :plantacao="plantacao" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { plantacoesStore } from '../store/plantacoes'
import CardPlantacao from '../components/CardPlantacao.vue'

const plantacoes = ref([])

// Opções de filtro
const culturas = [
  { title: 'Milho', value: 'milho' },
  { title: 'Soja', value: 'soja' }
]

const statusOptions = [
  { title: 'Plantado', value: 'plantado' },
  { title: 'Em crescimento', value: 'crescimento' },
  { title: 'Colhido', value: 'colhido' }
]

// Estado dos filtros
const filtros = reactive({
  cultura: null,
  status: null,
  busca: ''
})

// Carrega os dados quando o componente é montado
onMounted(() => {
  plantacoes.value = plantacoesStore.getPlantacoes()
})

// Filtra as plantações com base nos critérios selecionados
const plantacoesFiltradas = computed(() => {
  return plantacoes.value.filter(p => {
    // Filtro por cultura
    if (filtros.cultura && p.cultura !== filtros.cultura) {
      return false
    }
    
    // Filtro por status
    if (filtros.status && p.status !== filtros.status) {
      return false
    }
    
    // Filtro por busca textual
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase()
      const conteudo = `${p.nome} ${p.localizacao}`.toLowerCase()
      
      if (!conteudo.includes(termoBusca)) {
        return false
      }
    }
    
    return true
  })
})

// Função para limpar todos os filtros
const limparFiltros = () => {
  filtros.cultura = null
  filtros.status = null
  filtros.busca = ''
}
</script>