import { createRouter, createWebHistory } from 'vue-router'
import Account from '../views/Account.vue'
import Login from '../views/Login.vue'
import Tickets from '../views/Tickets.vue'
import Invoices from '../views/Invoices.vue'
import Teams from '../views/Teams.vue'
import Services from '../views/Services.vue'
import Profile from "../views/Profile.vue"

const routes = [
  {
    path: '/',
    name: Login,
    component: Login
  },
  {
    path: '/login',
    name: Login,
    component: Login
  },
  {
    path: '/profile',
    name: Profile,
    component: Profile
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    children: [
      {
        path: 'tickets',
        name: 'tickets',
        component: Tickets,
      },
      {
        path: 'teams',
        name: 'teams',
        component: Teams,
      },
      {
        path: 'invoices',
        name: 'invoices',
        component: Invoices
      },
      {
        path: 'services',
        name: 'services',
        component: Services
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes
})



export default router