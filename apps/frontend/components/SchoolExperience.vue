<template>
  <!-- 學校經歷列表 -->
  <div v-if="validSchoolExperiences.length > 0" style="padding: 2rem; border-top: 1px solid var(--color-border-tertiary);">
    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
      <svg style="width: 1.5rem; height: 1.5rem; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
      </svg>
      <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--color-text-primary);">{{ $t('profile.schoolExperience') }}</h3>
    </div>
    <div style="display: flex; flex-direction: column; gap: 1rem;">
      <div v-for="exp in validSchoolExperiences" :key="exp.id || exp.school + exp.degree" style="padding: 1.5rem; background: var(--color-bg-secondary); border-radius: 0.75rem; border: 1px solid var(--color-border-tertiary);">
        <div style="display: flex; gap: 1rem; align-items: flex-start;">
          <div v-if="isBase64Image(exp.logo)" style="width: 3rem; height: 3rem; border-radius: 0.5rem; overflow: hidden; flex-shrink: 0;">
            <img :src="exp.logo" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>
          <div v-else style="width: 3rem; height: 3rem; background: var(--color-bg-tertiary); border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <svg style="width: 1.5rem; height: 1.5rem; color: var(--color-text-tertiary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <div style="flex: 1;">
            <div v-if="exp.degree" style="font-weight: 600; color: var(--color-text-primary); font-size: 1.125rem; margin-bottom: 0.25rem;">{{ exp.degree }}</div>
            <div style="font-weight: 500; color: var(--color-primary); margin-bottom: 0.25rem;">
              <template v-if="exp.schoolLink">
                <a :href="exp.schoolLink" target="_blank" style="color: var(--color-primary); text-decoration: none; font-weight: 500;" onmouseover="this.style.textDecoration='underline'" onmouseout="this.style.textDecoration='none'">{{ exp.school }}</a>
              </template>
              <template v-else>{{ exp.school }}</template>
            </div>
            <div v-if="exp.major" style="font-size: 0.875rem; color: var(--color-text-secondary); margin-bottom: 0.5rem;">{{ $t('profile.major') }}: {{ exp.major }}</div>
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
import { computed } from 'vue'

const { t } = useI18n()

const props = defineProps({
  schoolExperiences: {
    type: Array,
    default: () => []
  }
})

// 过滤有效的学校经历（至少要有学校名称）
const validSchoolExperiences = computed(() => {
  return props.schoolExperiences.filter(exp => exp.school && exp.school.trim())
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