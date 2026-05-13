<script setup lang="ts">
const usersStore = useUsersStore()

const userId = ref<number | null>(null)
const selectedUser = ref<any>(null)

const handleSearch = async () => {
  if (!userId.value) return

  // validação simples
  if (userId.value < 1 || userId.value > 30) {
    selectedUser.value = null
    return
  }

  selectedUser.value = null

  const user = await usersStore.fetchUserById(userId.value)

  selectedUser.value = user
}

onMounted(() => {
  usersStore.fetchUsers()
})
</script>

<template>
  <div class="container">
    <h1>Pinia Cache Lab</h1>

    <div style="margin-top: 20px;">
  <h3>Buscar usuário por ID</h3>

  <input
  v-model.number="userId"
  type="number"
  min="1"
  max="30"
  placeholder="Digite o ID (1-30)"
/>

  <button @click="handleSearch">
    Buscar
  </button>
</div>

    <div class="buttons">
      <button @click="usersStore.fetchUsers()">
        Buscar usuários
      </button>

      <button @click="usersStore.fetchUsers(true)">
        Forçar request
      </button>

      <button @click="usersStore.clearCache()">
        Limpar cache
      </button>
    </div>

    <p v-if="usersStore.loading">
     🔄 Buscando dados...
    </p>

    <p>
      Cache ativo:
      {{ usersStore.hasCache }}
    </p>

    <div v-if="selectedUser" style="margin-top: 20px;">
  <h4>Resultado:</h4>
  <p>ID: {{ selectedUser.id }}</p>
  <p>Nome: {{ selectedUser.name }}</p>
  <p>Email: {{ selectedUser.email }}</p>
  </div>

  <div v-else-if="userId && !usersStore.loading" style="margin-top: 20px;">
    <p>❌ Nenhum usuário encontrado</p>
  </div>

    <p>
      Requests feitas:
      {{ usersStore.requestCount }}
    </p>

    <p>
      Última origem:
      {{ usersStore.lastSource }}
    </p>


    <p>
      Última busca:
      {{ usersStore.lastFetch }}
    </p>

    <ul>
      <li
        v-for="user in usersStore.users"
        :key="user.id"
      >
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  padding: 40px;
  font-family: Arial;
}

.buttons {
  display: flex;
  gap: 12px;
  margin: 20px 0;
}

button {
  padding: 10px 16px;
  cursor: pointer;
  border: none;
  border-radius: 8px;
}

ul {
  margin-top: 20px;
}

li {
  margin-bottom: 10px;
}
</style>