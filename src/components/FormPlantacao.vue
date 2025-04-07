<template>
  <v-form @submit.prevent="submitForm" ref="form">
    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="plantacaoData.nome"
            label="Nome da Plantação"
            hint="Ex: Fazenda São Pedro"
            :rules="[v => !!v || 'Nome é obrigatório']"
            required
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-select
            v-model="plantacaoData.cultura"
            :items="culturas"
            label="Cultura"
            required
            :rules="[v => !!v || 'Selecione a cultura']"
          ></v-select>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="plantacaoData.area"
            label="Área"
            type="number"
            min="0"
            :rules="[v => v > 0 || 'Área deve ser maior que zero']"
            required
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-select
            v-model="plantacaoData.unidade"
            :items="unidades"
            label="Unidade de Medida"
            required
          ></v-select>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="plantacaoData.dataPlantio"
            label="Data de Plantio"
            type="date"
            :rules="[v => !!v || 'Data de plantio é obrigatória']"
            required
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field
            v-model="plantacaoData.previsaoColheita"
            label="Previsão de Colheita"
            type="date"
            :rules="[
              v => !!v || 'Previsão de colheita é obrigatória',
              v => !plantacaoData.dataPlantio || new Date(v) > new Date(plantacaoData.dataPlantio) || 'Data de colheita deve ser posterior ao plantio'
            ]"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="plantacaoData.localizacao"
            label="Localização"
            hint="Ex: Norte do Paraná"
            :rules="[v => !!v || 'Localização é obrigatória']"
            required
          ></v-text-field>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="plantacaoData.rendimentoEstimado"
            label="Rendimento Estimado (ton/ha)"
            type="number"
            step="0.1"
            min="0"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6" v-if="isEditing && plantacaoData.status === 'colhido'">
          <v-text-field
            v-model="plantacaoData.rendimentoReal"
            label="Rendimento Real (ton/ha)"
            type="number"
            step="0.1"
            min="0"
          ></v-text-field>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12">
          <v-textarea
            v-model="plantacaoData.observacoes"
            label="Observações"
            hint="Informações adicionais sobre a plantação"
            rows="3"
          ></v-textarea>
        </v-col>
      </v-row>
      
      <v-row v-if="isEditing">
        <v-col cols="12">
          <v-select
            v-model="plantacaoData.status"
            :items="statusOptions"
            label="Status da Plantação"
            required
          ></v-select>
        </v-col>
      </v-row>
      
      <v-row>
        <v-col cols="12" class="d-flex justify-end">
          <v-btn type="button" variant="outlined" class="me-4" @click="resetForm">
            Limpar
          </v-btn>
          <v-btn type="submit" color="primary">
            {{ isEditing ? 'Atualizar' : 'Cadastrar' }} Plantação
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'

const props = defineProps({
  plantacao: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['submit'])
const form = ref(null)

// Lista de culturas disponíveis
const culturas = [
  { title: 'Milho', value: 'milho' },
  { title: 'Soja', value: 'soja' }
]

// Lista de unidades de medida
const unidades = [
  { title: 'Hectares', value: 'hectares' },
  { title: 'Alqueires', value: 'alqueires' }
]

// Lista de status possíveis
const statusOptions = [
  { title: 'Plantado', value: 'plantado' },
  { title: 'Em crescimento', value: 'crescimento' },
  { title: 'Colhido', value: 'colhido' }
]

// Verifica se estamos editando uma plantação existente
const isEditing = computed(() => !!props.plantacao)

// Dados do formulário
const plantacaoData = reactive({
  nome: '',
  cultura: 'milho',
  dataPlantio: '',
  previsaoColheita: '',
  area: null,
  unidade: 'hectares',
  localizacao: '',
  status: 'plantado',
  rendimentoEstimado: null,
  rendimentoReal: null,
  observacoes: ''
})

// Carrega os dados quando estiver editando
onMounted(() => {
  if (props.plantacao) {
    Object.keys(plantacaoData).forEach(key => {
      if (props.plantacao[key] !== undefined) {
        plantacaoData[key] = props.plantacao[key]
      }
    })
  }
})

// Função para submeter o formulário
const submitForm = async () => {
  const { valid } = await form.value.validate()
  
  if (valid) {
    emit('submit', { ...plantacaoData })
  }
}

// Função para resetar o formulário
const resetForm = () => {
  form.value.reset()
}
</script>