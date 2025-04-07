import { createRouter, createWebHistory } from 'vue-router'

import Dashboard from '../views/Dashboard.vue'
import ListaPlantacoes from '../views/ListaPlantacoes.vue'
import CadastroPlantacao from '../views/CadastroPlantacao.vue'
import DetalhesPlantacao from '../views/DetalhesPlantacao.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/plantacoes',
    name: 'Plantacoes',
    component: ListaPlantacoes
  },
  {
    path: '/cadastro',
    name: 'Cadastro',
    component: CadastroPlantacao
  },
  {
    path: '/plantacao/:id',
    name: 'Detalhes',
    component: DetalhesPlantacao,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router