<template>
  <v-container>
    <!-- Carregando ou dados não encontrados -->
    <v-row v-if="carregando">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
        <div class="mt-2">Carregando detalhes da plantação...</div>
      </v-col>
    </v-row>
    
    <v-row v-else-if="!plantacao">
      <v-col cols="12">
        <v-alert type="error">
          Plantação não encontrada. A plantação pode ter sido excluída ou o ID fornecido é inválido.
          <div class="mt-3">
            <v-btn color="primary" to="/plantacoes">
              Voltar para lista de plantações
            </v-btn>
          </div>
        </v-alert>
      </v-col>
    </v-row>
    
    <!-- Detalhes da plantação -->
    <template v-else>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between flex-wrap mb-4">
            <div>
              <h1 class="text-h4">{{ plantacao.nome }}</h1>
              <div class="d-flex align-center">
                <span class="text-subtitle-1 me-3">
                  {{ plantacao.cultura === 'milho' ? 'Milho 🌽' : 'Soja 🌱' }}
                </span>
                <tag-status :status="plantacao.status" />
              </div>
            </div>
            
            <div class="d-flex flex-wrap mt-2 mt-sm-0">
              <v-btn 
                color="primary" 
                variant="outlined" 
                class="me-2"
                prepend-icon="mdi-pencil"
                @click="modoEdicao = !modoEdicao"
              >
                {{ modoEdicao ? 'Cancelar' : 'Editar' }}
              </v-btn>
              
              <v-btn 
                color="error" 
                variant="outlined"
                prepend-icon="mdi-delete"
                @click="confirmarExclusao = true"
              >
                Excluir
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
      
      <!-- Modo de edição -->
      <v-row v-if="modoEdicao">
        <v-col cols="12">
          <v-card>
            <v-card-title>Editar Plantação</v-card-title>
            <v-card-text>
              <form-plantacao 
                :plantacao="plantacao" 
                @submit="atualizarPlantacao"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Modo de visualização -->
      <template v-else>
        <v-row>
          <!-- Informações gerais -->
          <v-col cols="12" md="6">
            <v-card class="mb-4">
              <v-card-title>Informações Gerais</v-card-title>
              <v-card-text>
                <v-list>
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-map-marker"></v-icon>
                    </template>
                    <v-list-item-title>Localização</v-list-item-title>
                    <v-list-item-subtitle>{{ plantacao.localizacao }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item>
                    <template v-slot:prepend>
                      <v-icon icon="mdi-resize"></v-icon>
                    </template>
                    <v-list-item-title>Área</v-list-item-title>
                    <v-list-item-subtitle>{{ plantacao.area }} {{ plantacao.unidade }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
            
            <!-- Observações -->
            <v-card>
              <v-card-title>Observações</v-card-title>
              <v-card-text>
                <p v-if="plantacao.observacoes">{{ plantacao.observacoes }}</p>
                <p v-else class="text-grey">Nenhuma observação registrada</p>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Cronograma e Rendimento -->
          <v-col cols="12" md="6">
            <v-card class="mb-4">
              <v-card-title>Cronograma</v-card-title>
              <v-card-text>
                <v-timeline density="compact" align="start">
                  <v-timeline-item 
                    dot-color="primary"
                    icon="mdi-seed"
                  >
                    <div class="text-subtitle-1 font-weight-medium">Plantio</div>
                    <div>{{ formatarData(plantacao.dataPlantio) }}</div>
                  </v-timeline-item>
                  
                  <v-timeline-item 
                    v-if="plantacao.status === 'crescimento'"
                    dot-color="success"
                    icon="mdi-sprout"
                  >
                    <div class="text-subtitle-1 font-weight-medium">Em crescimento</div>
                    <div>{{ calcularDiasEmCrescimento() }} dias desde o plantio</div>
                  </v-timeline-item>
                  
                  <v-timeline-item 
                    v-if="plantacao.status === 'colhido'"
                    dot-color="success"
                    icon="mdi-basket"
                  >
                    <div class="text-subtitle-1 font-weight-medium">Colheita realizada</div>
                  </v-timeline-item>
                  
                  <v-timeline-item 
                    v-else
                    dot-color="grey"
                    icon="mdi-calendar"
                  >
                    <div class="text-subtitle-1 font-weight-medium">Previsão de Colheita</div>
                    <div>{{ formatarData(plantacao.previsaoColheita) }}</div>
                    <div v-if="calcularDiasParaColheita() > 0" class="text-caption">
                      Faltam {{ calcularDiasParaColheita() }} dias
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>
            </v-card>
            
            <v-card>
              <v-card-title>Rendimento</v-card-title>
              <v-card-text>
                <div class="d-flex flex-column">
                  <div class="mb-3">
                    <div class="text-subtitle-2">Rendimento Estimado:</div>
                    <div class="text-h5">
                      {{ plantacao.rendimentoEstimado || '-' }} ton/ha
                    </div>
                  </div>
                  
                  <div v-if="plantacao.status === 'colhido'">
                    <div class="text-subtitle-2">Rendimento Real:</div>
                    <div class="text-h5">
                      {{ plantacao.rendimentoReal || '-' }} ton/ha
                    </div>
                    
                    <v-chip 
                      v-if="plantacao.rendimentoReal && plantacao.rendimentoEstimado"
                      :color="rendimentoCompare.color"
                      class="mt-2"
                      prepend-icon="mdi-chart-line-variant"
                    >
                      {{ rendimentoCompare.text }}
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </template>
    
    <!-- Diálogo de confirmação de exclusão -->
    <v-dialog v-model="confirmarExclusao" max-width="500">
      <v-card>
        <v-card-title class="text-h5">
          Excluir plantação
        </v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir a plantação "{{ plantacao?.nome }}"? 
          Esta ação não pode ser desfeita.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="confirmarExclusao = false">
            Cancelar
          </v-btn>
          <v-btn color="error" variant="elevated" @click="excluirPlantacao">
            Excluir
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar para feedback -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn
          variant="text"
          @click="snackbar.show = false"
        >
          Fechar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { plantacoesStore } from '../store/plantacoes'
import TagStatus from '../components/TagStatus.vue'
import FormPlantacao from '../components/FormPlantacao.vue'

const router = useRouter()
const route = useRoute()
const plantacao = ref(null)
const carregando = ref(true)
const modoEdicao = ref(false)
const confirmarExclusao = ref(false)

// Estado para o snackbar de notificação
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Busca os dados da plantação quando o componente é montado
onMounted(() => {
  carregarPlantacao()
})

// Carrega os dados da plantação
const carregarPlantacao = () => {
  carregando.value = true
  
  setTimeout(() => {
    const id = Number(route.params.id)
    plantacao.value = plantacoesStore.getPlantacaoById(id)
    carregando.value = false
  }, 500) // Simula um tempo de carregamento
}

// Formata a data para exibição
const formatarData = (data) => {
  if (!data) return 'Data não informada'
  
  const dataObj = new Date(data)
  return dataObj.toLocaleDateString('pt-BR')
}

// Calcula quantos dias faltam para a colheita
const calcularDiasParaColheita = () => {
  if (!plantacao.value || !plantacao.value.previsaoColheita) return 0
  
  const hoje = new Date()
  const colheita = new Date(plantacao.value.previsaoColheita)
  const diferencaTempo = colheita.getTime() - hoje.getTime()
  const diasFaltando = Math.ceil(diferencaTempo / (1000 * 3600 * 24))
  
  return diasFaltando > 0 ? diasFaltando : 0
}

// Calcula quantos dias a plantação está em crescimento
const calcularDiasEmCrescimento = () => {
  if (!plantacao.value || !plantacao.value.dataPlantio) return 0
  
  const hoje = new Date()
  const plantio = new Date(plantacao.value.dataPlantio)
  const diferencaTempo = hoje.getTime() - plantio.getTime()
  return Math.ceil(diferencaTempo / (1000 * 3600 * 24))
}

// Compara o rendimento real com o estimado
const rendimentoCompare = computed(() => {
  if (!plantacao.value || !plantacao.value.rendimentoReal || !plantacao.value.rendimentoEstimado) {
    return { text: '', color: '' }
  }
  
  const real = plantacao.value.rendimentoReal
  const estimado = plantacao.value.rendimentoEstimado
  const diferenca = ((real - estimado) / estimado * 100).toFixed(1)
  
  if (real > estimado) {
    return { text: `${diferenca}% acima do estimado`, color: 'success' }
  } else if (real < estimado) {
    return { text: `${Math.abs(diferenca)}% abaixo do estimado`, color: 'warning' }
  } else {
    return { text: 'Igual ao estimado', color: 'info' }
  }
})

// Função para atualizar a plantação
const atualizarPlantacao = (dadosAtualizados) => {
  try {
    // Adiciona o ID aos dados atualizados
    const dadosComId = { ...dadosAtualizados, id: plantacao.value.id }
    
    // Atualiza no store
    const sucesso = plantacoesStore.updatePlantacao(dadosComId)
    
    if (sucesso) {
      // Atualiza a plantação local
      plantacao.value = dadosComId
      
      // Exibe mensagem de sucesso
      snackbar.value = {
        show: true,
        text: 'Plantação atualizada com sucesso!',
        color: 'success'
      }
      
      // Sai do modo de edição
      modoEdicao.value = false
    } else {
      throw new Error('Erro ao atualizar plantação')
    }
  } catch (erro) {
    // Exibe mensagem de erro
    snackbar.value = {
      show: true,
      text: `Erro ao atualizar plantação: ${erro.message}`,
      color: 'error'
    }
  }
}

// Função para excluir a plantação
const excluirPlantacao = () => {
  try {
    const sucesso = plantacoesStore.deletePlantacao(plantacao.value.id)
    
    if (sucesso) {
      // Exibe mensagem de sucesso
      snackbar.value = {
        show: true,
        text: `Plantação "${plantacao.value.nome}" excluída com sucesso!`,
        color: 'success'
      }
      
      // Fecha o diálogo de confirmação
      confirmarExclusao.value = false
      
      // Redireciona para a lista de plantações
      setTimeout(() => {
        router.push('/plantacoes')
      }, 1000)
    } else {
      throw new Error('Erro ao excluir plantação')
    }
  } catch (erro) {
    // Exibe mensagem de erro
    snackbar.value = {
      show: true,
      text: `Erro ao excluir plantação: ${erro.message}`,
      color: 'error'
    }
    
    // Fecha o diálogo de confirmação
    confirmarExclusao.value = false
  }
}
</script>