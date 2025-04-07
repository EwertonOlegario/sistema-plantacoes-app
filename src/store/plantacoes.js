import { reactive } from 'vue'

// Dados fixos iniciais
const dadosIniciais = [
  {
    id: 1,
    nome: 'Fazenda São Pedro',
    cultura: 'milho',
    dataPlantio: '2025-02-15',
    previsaoColheita: '2025-06-25',
    area: 150,
    unidade: 'hectares',
    localizacao: 'Norte do Paraná',
    status: 'crescimento',
    rendimentoEstimado: 9.2,
    observacoes: 'Plantação em bom estado, sem pragas detectadas.'
  },
  {
    id: 2,
    nome: 'Sítio Esperança',
    cultura: 'soja',
    dataPlantio: '2025-01-10',
    previsaoColheita: '2025-05-01',
    area: 85,
    unidade: 'hectares',
    localizacao: 'Sudoeste de Goiás',
    status: 'plantado',
    rendimentoEstimado: 3.5,
    observacoes: 'Plantação recente, monitorar umidade.'
  },
  {
    id: 3,
    nome: 'Fazenda Boa Vista',
    cultura: 'milho',
    dataPlantio: '2024-10-20',
    previsaoColheita: '2025-03-01',
    area: 220,
    unidade: 'hectares',
    localizacao: 'Oeste da Bahia',
    status: 'colhido',
    rendimentoEstimado: 8.7,
    rendimentoReal: 8.5,
    observacoes: 'Colheita finalizada com produtividade satisfatória.'
  },
  {
    id: 4,
    nome: 'Fazenda Verdejante',
    cultura: 'soja',
    dataPlantio: '2025-03-05',
    previsaoColheita: '2025-11-15',
    area: 50,
    unidade: 'hectares',
    localizacao: 'Sul de Minas Gerais',
    status: 'crescimento',
    rendimentoEstimado: 12.0,
    observacoes: 'Monitorar pragas e doenças.'
  },
  {
    id: 5,
    nome: 'Sítio da Serra',
    cultura: 'milho',
    dataPlantio: '2025-02-01',
    previsaoColheita: '2025-07-15',
    area: 30,
    unidade: 'hectares',
    localizacao: 'Centro-Oeste do Brasil',
    status: 'plantado',
    rendimentoEstimado: 25.0,
    observacoes: 'Acompanhamento semanal necessário.'
  }
]

// Função para sanitizar os dados das plantações
function sanitizarPlantacoes(plantacoes) {
  return plantacoes.map((p, index) => ({
    id: p.id || index + 1,
    nome: p.nome || 'Sem nome',
    cultura: p.cultura || 'milho',
    dataPlantio: p.dataPlantio || '',
    previsaoColheita: p.previsaoColheita || '',
    area: Number(p.area) || 0,
    unidade: p.unidade || 'hectares',
    localizacao: p.localizacao || '',
    status: p.status || 'plantado',
    rendimentoEstimado: p.rendimentoEstimado !== null && p.rendimentoEstimado !== undefined
      ? Number(p.rendimentoEstimado)
      : null,
    rendimentoReal: p.rendimentoReal !== null && p.rendimentoReal !== undefined
      ? Number(p.rendimentoReal)
      : null,
    observacoes: p.observacoes || ''
  }))
}

// Verifica se já existem dados salvos no localStorage
const dadosSalvos = JSON.parse(localStorage.getItem('plantacoes'))

let dadosFinal

if (!dadosSalvos) {
  // Primeira vez: salva os dados iniciais e usa eles
  localStorage.setItem('plantacoes', JSON.stringify(dadosIniciais))
  dadosFinal = [...dadosIniciais]
} else {
  // Caso já existam dados, sanitiza antes de usar
  dadosFinal = sanitizarPlantacoes(dadosSalvos)
}

// Cria a store reativa para as plantações
export const plantacoesStore = reactive({
  plantacoes: dadosFinal,

  // Métodos para manipular as plantações
  getPlantacoes() {
    return this.plantacoes
  },

  getPlantacaoById(id) {
    return this.plantacoes.find(p => p.id === Number(id))
  },

  addPlantacao(plantacao) {
    const newId = this.plantacoes.length > 0
      ? Math.max(...this.plantacoes.map(p => p.id)) + 1
      : 1
  
    // Sanitize a nova plantação antes de adicionar
    const novaPlantacao = sanitizarPlantacoes([{
      ...plantacao,
      id: newId,
      status: 'plantado'
    }])[0]
  
    this.plantacoes.push(novaPlantacao)
    this.salvarNoLocalStorage()
    return novaPlantacao
  },
 
  updatePlantacao(plantacao) {
    const index = this.plantacoes.findIndex(p => p.id === plantacao.id)
    if (index !== -1) {
      this.plantacoes[index] = { ...plantacao }
      this.salvarNoLocalStorage()
      return true
    }
    return false
  },

  deletePlantacao(id) {
    const index = this.plantacoes.findIndex(p => p.id === Number(id))
    if (index !== -1) {
      this.plantacoes.splice(index, 1)
      this.salvarNoLocalStorage()
      return true
    }
    return false
  },

  salvarNoLocalStorage() {
    localStorage.setItem('plantacoes', JSON.stringify(this.plantacoes))
  }
})
