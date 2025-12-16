<template>
  <!-- 工作经历列表 -->
  <div v-if="workExperiences && workExperiences.length > 0" style="padding: 2rem; border-top: 1px solid var(--color-border-tertiary);">
    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
      <svg style="width: 1.5rem; height: 1.5rem; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
      <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--color-text-primary);">{{ $t('profile.workExperience') }}</h3>
    </div>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div v-for="exp in workExperiences" :key="exp.id || exp.company + exp.position" style="padding: 1.5rem; background: var(--color-bg-secondary); border-radius: 0.75rem; border: 1px solid var(--color-border-tertiary);">
        <div style="display: flex; gap: 1rem; align-items: flex-start;">
          <div v-if="isBase64Image(exp.logo)" style="width: 3rem; height: 3rem; border-radius: 0.5rem; overflow: hidden; flex-shrink: 0;">
            <img :src="exp.logo" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div v-else style="width: 3rem; height: 3rem; background: var(--color-bg-tertiary); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg style="width: 1.5rem; height: 1.5rem; color: var(--color-text-tertiary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div style="flex: 1;">
            <div style="font-weight: 600; color: var(--color-text-primary); font-size: 1.125rem; margin-bottom: 0.25rem;">{{ exp.position }}</div>
            <div style="font-weight: 500; color: var(--color-primary); margin-bottom: 0.5rem;">
              <template v-if="exp.companyLink">
                <a :href="exp.companyLink" target="_blank" style="color: var(--color-primary); text-decoration: none; font-weight: 500;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ exp.company }}</a>
              </template>
              <template v-else>{{ exp.company }}</template>
            </div>
            <div style="font-size: 0.875rem; color: var(--color-text-tertiary); margin-bottom: 0.75rem;">
              {{ formatDate(exp.startDate) }} - {{ exp.endDate ? formatDate(exp.endDate) : $t('profile.present') }}
            </div>
            <div v-if="exp.description" style="font-size: 0.875rem; color: var(--color-text-secondary); line-height: 1.5;">{{ exp.description }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  workExperiences: {
    type: Array,
    default: () => []
  }
})

// 检查是否为base64图片
const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>