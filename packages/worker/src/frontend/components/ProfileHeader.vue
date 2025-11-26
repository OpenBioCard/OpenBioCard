<template>
  <div>
    <!-- 头部横幅 -->
    <div style="height: 8rem; position: relative; overflow: hidden;">
      <div
        v-if="isBase64Image(profileData.background)"
        style="width: 100%; height: 100%; background-size: cover; background-position: center; background-repeat: no-repeat;"
        :style="{ backgroundImage: `url(${profileData.background})` }"
      ></div>
      <div
        v-else
        style="width: 100%; height: 100%; background: #000000;"
      ></div>
      <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.1);"></div>
    </div>

    <!-- 主要内容区域 -->
    <div style="padding: 2rem;">
      <!-- 用户头像和基本信息 -->
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-top: -4rem; position: relative; z-index: 10;">
        <div style="position: relative;">
          <div style="width: 8rem; height: 8rem; background: #000000; border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: white; font-size: 2.5rem; font-weight: bold; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 4px solid white; overflow: hidden;">
            <template v-if="isBase64Image(profileData.avatar)">
              <img :src="profileData.avatar" style="width: 100%; height: 100%; object-fit: cover;" />
            </template>
            <template v-else>
              {{ profileData.avatar || profileData.username.charAt(0).toUpperCase() }}
            </template>
          </div>
          <!-- ���辑按钮 -->
          <button
            v-if="canEdit"
            @click="$emit('toggle-edit')"
            style="position: absolute; bottom: -0.5rem; right: -0.5rem; width: 3rem; height: 3rem; background: #000000; color: white; border-radius: 50%; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; transform: scale(1);"
            onmouseover="this.style.transform='scale(1.1)'; this.style.backgroundColor='#333333'"
            onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='#000000'"
          >
            <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
        </div>
        <div style="flex: 1; padding-top: 1rem;">
          <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;">
            <h2 style="font-size: 1.875rem; font-weight: bold; color: #111827;">{{ profileData.name || profileData.username }}</h2>
            <span style="padding: 0.25rem 0.75rem; background: #f3f4f6; color: #111827; font-size: 0.875rem; font-weight: 500; border-radius: 9999px; border: 1px solid #e5e7eb;">
              @{{ profileData.username }}
            </span>
          </div>
          <p style="color: #6b7280; font-size: 1.125rem; margin-bottom: 1rem; line-height: 1.75;">{{ profileData.bio || '这个人很懒，还没有写简介...' }}</p>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.875rem; color: #9ca3af;">
            <span v-if="profileData.location" style="display: flex; align-items: center; gap: 0.25rem;">
              📍 {{ profileData.location }}
            </span>
            <span v-if="profileData.website" style="display: flex; align-items: center; gap: 0.25rem;">
              🌐 <a :href="profileData.website" target="_blank" style="color: #000000; text-decoration: none; font-weight: 500;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ profileData.website }}</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  profileData: {
    type: Object,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-edit'])

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}
</script>
