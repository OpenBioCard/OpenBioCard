<template>
  <div style="min-height: 100vh; background: linear-gradient(135deg, #f9fafb 0%, #ffffff 50%, #f9fafb 100%); display: flex; align-items: center; justify-content: center; padding: 2rem;">
    <div style="width: 100%; max-width: 420px;">
      <!-- Logo 和标题 -->
      <div style="text-align: center; margin-bottom: 3rem;">
        <div style="width: 4rem; height: 4rem; background: #000000; border-radius: 1rem; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;">
          <span style="color: white; font-weight: bold; font-size: 1.5rem;">O</span>
        </div>
        <h1 style="font-size: 2rem; font-weight: bold; color: #111827; margin: 0 0 0.5rem;">OpenBioCard</h1>
        <p style="color: #6b7280; margin: 0;">登录到您的账户</p>
      </div>

      <!-- 登录表单 -->
      <div style="background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 1rem; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.8); padding: 2rem;">
        <form @submit.prevent="handleLogin" style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div>
            <label for="username" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
              用户名
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="请输入用户名"
              required
              autocomplete="username"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s; font-size: 0.9375rem; box-sizing: border-box;"
              onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
            />
          </div>

          <div>
            <label for="password" style="display: block; font-size: 0.875rem; font-weight: 600; color: #374151; margin-bottom: 0.5rem;">
              密码
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="请输入密码"
              required
              autocomplete="current-password"
              style="width: 100%; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s; font-size: 0.9375rem; box-sizing: border-box;"
              onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
              onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            style="width: 100%; padding: 0.875rem; background: #000000; color: white; border: none; border-radius: 0.5rem; font-size: 0.9375rem; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; min-height: 3rem;"
            :style="{ opacity: loading ? 0.7 : 1 }"
            onmouseover="if(!this.disabled) this.style.backgroundColor='#333333'"
            onmouseout="this.style.backgroundColor='#000000'"
          >
            <span v-if="!loading">登录</span>
            <div v-else style="width: 1.25rem; height: 1.25rem; border: 2px solid rgba(255, 255, 255, 0.3); border-top-color: white; border-radius: 50%; animation: spin 0.6s linear infinite;"></div>
          </button>
        </form>

        <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(229, 231, 235, 0.8); text-align: center;">
          <p style="font-size: 0.875rem; color: #6b7280; margin: 0;">
            首次使用？请联系系统管理员创建账号
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['login'])

const username = ref('')
const password = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) return

  loading.value = true
  try {
    await emit('login', username.value, password.value)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
