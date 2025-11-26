<template>
  <nav style="background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); border-bottom: 1px solid rgba(229, 231, 235, 0.8); position: sticky; top: 0; z-index: 50;">
    <div style="max-width: 1152px; margin: 0 auto; padding: 0 1rem;">
      <div style="display: flex; justify-content: space-between; align-items: center; height: 4rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 2rem; height: 2rem; background: #000000; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center;">
            <span style="color: white; font-weight: bold; font-size: 0.875rem;">O</span>
          </div>
          <h1 style="font-size: 1.25rem; font-weight: bold; color: #000000;">
            OpenBioCard
          </h1>
        </div>
        <div style="display: flex; align-items: center; gap: 1rem;">
          <span v-if="currentUser" style="font-size: 0.875rem; color: #6b7280; font-weight: 500;">
            欢迎，{{ currentUser.username }}
          </span>
          <button
            v-if="currentUser"
            @click="$emit('logout')"
            style="font-size: 0.875rem; padding: 0.375rem 0.75rem; color: #6b7280; border-radius: 0.375rem; transition: all 0.2s; border: none; background: transparent; cursor: pointer;"
            onmouseover="this.style.backgroundColor='#f3f4f6'; this.style.color='#111827'"
            onmouseout="this.style.backgroundColor='transparent'; this.style.color='#6b7280'"
          >
            退出登录
          </button>
          <button
            v-else
            @click="goToLogin"
            style="font-size: 0.875rem; padding: 0.375rem 0.75rem; background: #000000; color: white; border-radius: 0.375rem; border: none; cursor: pointer; transition: background-color 0.2s; font-weight: 500;"
            onmouseover="this.style.backgroundColor='#333333'"
            onmouseout="this.style.backgroundColor='#000000'"
          >
            登录
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  currentUser: {
    type: Object,
    default: null
  }
})

defineEmits(['logout'])

const goToLogin = () => {
  window.location.href = '/frontend'
}
</script>
