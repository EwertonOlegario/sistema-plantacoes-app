<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Cadastrar Nova Plantação</h1>
      </v-col>
    </v-row>
    
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <form-plantacao @submit="salvarPlantacao" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import FormPlantacao from '../components/FormPlantacao.vue'
import { plantacoesStore } from '../store/plantacoes'

const router = useRouter()

// Estado para o snackbar de notificação
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

// Função para salvar a nova plantação
const salvarPlantacao = (plantacaoData) => {
  try {
    // Adiciona a plantação usando o store
    const novaPlantacao = plantacoesStore.addPlantacao(plantacaoData)
    
    // Exibe mensagem de sucesso
    snackbar.value = {
      show: true,
      text: `Plantação "${novaPlantacao.nome}" cadastrada com sucesso!`,
      color: 'success'
    }
    
    // Redireciona para a página de detalhes da nova plantação
    setTimeout(() => {
      router.push(`/plantacao/${novaPlantacao.id}`)
    }, 1000)
  } catch (erro) {
    // Exibe mensagem de erro
    snackbar.value = {
      show: true,
      text: `Erro ao cadastrar plantação: ${erro.message}`,
      color: 'error'
    }
  }
}
</script>