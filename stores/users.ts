import { defineStore } from 'pinia'
import type { User } from '~/types/user'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    usersById: {} as Record<number, User>,
    loaded: false,
    loading: false,
    lastFetch: null as number | null,
    lastSource: '' as 'api' | 'cache' | '',
    requestCount: 0,
  }),

  getters: {
    hasCache: state => state.users.length > 0
  },

  actions: {
    async fetchUsers(force = false) {
      if (this.loaded && !force) {
        this.lastSource = 'cache'
        return this.users
      }

      this.loading = true
      try {
        const api = useApi()
        const response = await api.getUsers()
        this.users = response
        this.loaded = true
        this.lastSource = 'api'
        this.lastFetch = Date.now()
        return response
      } finally {
        this.loading = false
      }
    },

    async fetchUserById(id: number) {
      if (this.usersById[id]) {
        console.log('⚡ USER VEIO DO CACHE')
        this.lastSource = 'cache'
        return this.usersById[id]
      }

      this.loading = true
      try {
        const api = useApi()
        this.requestCount++
        const user = await api.getUserById(id)
        if (user) {
          this.usersById[id] = user
          this.lastSource = 'api'
        }
        return user
      } finally {
        this.loading = false
      }
    },

    clearCache() {
      this.users = []
      this.usersById = {}
      this.loaded = false
      this.lastFetch = null
      this.lastSource = ''
      this.requestCount = 0
    }
  }
})