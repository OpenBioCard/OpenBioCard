<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center py-4">
          <h1 class="text-2xl font-bold text-gray-900">管理面板</h1>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-600">欢迎, {{ user.username }}</span>
            <button
              @click="logout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              退出
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <!-- 创建用户 -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">创建用户</h2>
          <form @submit.prevent="createUser" class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label class="block text-sm font-medium text-gray-700">用户名</label>
              <input
                v-model="newUser.username"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">密码</label>
              <input
                v-model="newUser.password"
                type="password"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">类型</label>
              <select
                v-model="newUser.type"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">用户</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <div class="sm:col-span-3">
              <button
                type="submit"
                :disabled="creating"
                class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ creating ? '创建中...' : '创建用户' }}
              </button>
            </div>
          </form>
        </div>

        <!-- 用户列表 -->
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">用户列表</h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="u in users" :key="u.username">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ u.username }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ u.type }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        v-if="u.username !== user.username && u.type !== 'root'"
                        @click="deleteUser(u.username)"
                        class="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  user: Object,
  token: String
})

const emit = defineEmits(['logout'])

const users = ref([])
const newUser = ref({
  username: '',
  password: '',
  type: 'user'
})
const creating = ref(false)

const fetchUsers = async () => {
  if (!props.user || !props.token) {
    console.error('User or token not available')
    return
  }

  try {
    console.log('Fetching users for:', props.user.username)
    const response = await fetch('/admin/users/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: props.user.username, token: props.token })
    })
    if (response.ok) {
      const data = await response.json()
      console.log('Received users:', data.users)
      users.value = data.users || []
    } else {
      console.error('获取用户列表失败:', response.status, await response.text())
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

const createUser = async () => {
  if (!props.user || !props.token) {
    alert('用户信息不完整')
    return
  }

  creating.value = true
  try {
    console.log('Creating user:', newUser.value.username)
    const response = await fetch('/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: props.user.username,
        token: props.token,
        newUsername: newUser.value.username,
        password: newUser.value.password,
        type: newUser.value.type
      })
    })
    if (response.ok) {
      alert('用户创建成功')
      newUser.value = { username: '', password: '', type: 'user' }
      console.log('Refreshing user list after creation')
      await fetchUsers()
    } else {
      const errorData = await response.json()
      alert(`创建用户失败: ${errorData.error || '未知错误'}`)
    }
  } catch (error) {
    console.error('Create user error:', error)
    alert('创建用户错误')
  } finally {
    creating.value = false
  }
}

const deleteUser = async (username) => {
  if (!props.user || !props.token) {
    alert('用户信息不完整')
    return
  }

  if (!confirm(`确定要删除用户 ${username} 吗？`)) return

  try {
    console.log('Deleting user:', username)
    const response = await fetch(`/admin/users/${username}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: props.user.username, token: props.token })
    })
    if (response.ok) {
      alert('用户删除成功')
      console.log('Refreshing user list after deletion')
      await fetchUsers()
    } else {
      const errorData = await response.json()
      alert(`删除用户失败: ${errorData.error || '未知错误'}`)
    }
  } catch (error) {
    console.error('Delete user error:', error)
    alert('删除用户错误')
  }
}

const logout = () => {
  emit('logout')
}

onMounted(() => {
  fetchUsers()
})
</script>