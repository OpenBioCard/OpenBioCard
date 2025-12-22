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
        style="width: 100%; height: 100%; background: var(--color-primary);"
      ></div>
      <div style="position: absolute; inset: 0; background: rgba(0, 0, 0, 0.1);"></div>
    </div>

    <!-- 主要内容区域 -->
    <div style="padding: 2rem;">
      <!-- 用户头像和基本信息 -->
      <div style="display: flex; flex-direction: column; align-items: flex-start; gap: 1.5rem; margin-top: -4rem; position: relative; z-index: 10;">
        <div style="position: relative;">
          <div style="width: 8rem; height: 8rem; background: var(--color-primary); border-radius: 1rem; display: flex; align-items: center; justify-content: center; color: var(--color-text-inverse); font-size: 2.5rem; font-weight: bold; box-shadow: var(--shadow-md); border: 4px solid var(--color-bg-primary); overflow: hidden;">
            <template v-if="isBase64Image(profileData.avatar)">
              <img :src="profileData.avatar" style="width: 100%; height: 100%; object-fit: cover;" />
            </template>
            <template v-else>
              {{ profileData.avatar || profileData.username.charAt(0).toUpperCase() }}
            </template>
          </div>
          <!-- 编辑按钮 -->
          <button
            v-if="canEdit"
            @click="$emit('toggle-edit')"
            style="position: absolute; bottom: -0.5rem; right: -0.5rem; width: 3rem; height: 3rem; background: var(--color-primary); color: var(--color-text-inverse); border-radius: 50%; box-shadow: var(--shadow-md); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; transform: scale(1);"
            onmouseover="this.style.transform='scale(1.1)'; this.style.backgroundColor='var(--color-primary-hover)'"
            onmouseout="this.style.transform='scale(1)'; this.style.backgroundColor='var(--color-primary)'"
          >
            <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
          </button>
        </div>
        <div style="flex: 1; padding-top: 1rem;">
          <div class="profile-info-header">
            <div class="name-container">
              <h2 style="font-size: 1.875rem; font-weight: bold; color: var(--color-text-primary); margin: 0;">{{ profileData.name || profileData.username }}</h2>
              
              <!-- Share Button -->
              <button 
                @click="showShareModal = true"
                style="
                  background: none; 
                  border: none; 
                  cursor: pointer; 
                  color: var(--color-text-tertiary); 
                  padding: 4px; 
                  border-radius: 50%; 
                  display: flex; 
                  align-items: center; 
                  justify-content: center; 
                  transition: all 0.2s;
                "
                onmouseover="this.style.color='var(--color-primary)'; this.style.background='var(--color-bg-tertiary)'"
                onmouseout="this.style.color='var(--color-text-tertiary)'; this.style.background='none'"
                title="分享名片"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <path d="M8.59 13.51l6.83 3.98"></path>
                  <path d="M15.41 6.51l-6.82 3.98"></path>
                </svg>
              </button>
            </div>

            <div class="tags-container">
              <span style="padding: 0.25rem 0.75rem; background: var(--color-bg-tertiary); color: var(--color-text-primary); font-size: 0.875rem; font-weight: 500; border-radius: 9999px; border: 1px solid var(--color-border-primary); white-space: nowrap;">
                @{{ profileData.username }}
              </span>
              <span v-if="profileData.pronouns" style="padding: 0.25rem 0.75rem; background: var(--color-bg-secondary); color: var(--color-text-secondary); font-size: 0.875rem; font-weight: 500; border-radius: 9999px; border: 1px solid var(--color-border-secondary); white-space: nowrap;">
                {{ profileData.pronouns }}
              </span>
              <span v-if="profileData.userType" style="padding: 0.25rem 0.75rem; background: var(--color-bg-tertiary); color: var(--color-text-primary); font-size: 0.875rem; font-weight: 500; border-radius: 9999px; border: 1px solid var(--color-border-primary); white-space: nowrap;">
                {{ 
                  profileData.userType === 'organization' ? $t('profile.accountOrganization') : 
                  profileData.userType === 'company' ? $t('profile.accountCompany') : 
                  $t('profile.accountPersonal') 
                }}
              </span>
            </div>
          </div>
          <p style="color: var(--color-text-tertiary); font-size: 1.125rem; margin-bottom: 1rem; line-height: 1.75;" v-html="formatBio(profileData.bio) || $t('profile.defaultBio')"></p>
          <div style="display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.875rem; color: var(--color-text-tertiary);">
            <span v-if="profileData.location" style="display: flex; align-items: center; gap: 0.25rem;">
              📍 {{ profileData.location }}
            </span>
            <span v-if="profileData.website" style="display: flex; align-items: center; gap: 0.25rem;">
              🌐 <a :href="profileData.website" target="_blank" style="color: var(--color-primary); text-decoration: none; font-weight: 500;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ profileData.website }}</a>
            </span>
            <span v-if="profileData.currentCompany" style="display: flex; align-items: center; gap: 0.25rem;">
              🏢 <template v-if="profileData.currentCompanyLink"><a :href="profileData.currentCompanyLink" target="_blank" style="color: var(--color-primary); text-decoration: none; font-weight: 500;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ profileData.currentCompany }}</a></template><template v-else>{{ profileData.currentCompany }}</template>
            </span>
            <span v-if="profileData.currentSchool" style="display: flex; align-items: center; gap: 0.25rem;">
              🎓 <template v-if="profileData.currentSchoolLink"><a :href="profileData.currentSchoolLink" target="_blank" style="color: var(--color-primary); text-decoration: none; font-weight: 500;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ profileData.currentSchool }}</a></template><template v-else>{{ profileData.currentSchool }}</template>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Share Card Modal -->
    <ShareCardModal 
      :show="showShareModal" 
      :profileData="profileData" 
      :siteSettings="siteSettings"
      @close="showShareModal = false" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ShareCardModal from './ShareCardModal.vue'

defineProps({
  profileData: {
    type: Object,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  siteSettings: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['toggle-edit'])

const showShareModal = ref(false)

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const formatBio = (bio) => {
  if (!bio) return ''
  
  // Escape HTML to prevent XSS
  const escapedBio = bio
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  // Replace @username with link, avoiding email addresses (must be preceded by start of string or non-word char)
  return escapedBio.replace(/(^|[^a-zA-Z0-9_])@([a-zA-Z0-9_]+)/g, '$1<a href="/$2" style="color: var(--color-primary); text-decoration: none;" onmouseover="this.style.textDecoration=\'underline\'" onmouseout="this.style.textDecoration=\'none\'">@$2</a>')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
.profile-info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.name-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tags-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

@media (max-width: 767px) {
  .profile-info-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .tags-container {
    gap: 0.5rem;
  }
}
</style>
