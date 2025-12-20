<template>
  <div
    v-if="show"
    @click="close"
    style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.2); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;"
  >
    <div
      @click.stop
      :style="modalStyle"
    >
      <!-- 图标 -->
      <div style="display: flex; align-items: center; margin-bottom: 1rem;">
        <div :style="iconStyle">
          <svg v-if="type === 'success'" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else-if="type === 'error'" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <svg v-else fill="none" stroke="currentColor" viewBox="0 0 24 24" style="width: 1.5rem; height: 1.5rem;">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
        </div>
        <h3 :style="titleStyle">
          {{ title }}
        </h3>
      </div>

      <!-- 消息内容 -->
      <p :style="messageStyle">
        {{ message }}
      </p>

      <!-- 详细信息 (仅在有 details 时显示) -->
      <div v-if="details" style="margin-top: 1rem;">
        <button
          @click="showDetails = !showDetails"
          style="background: none; border: none; color: var(--color-accent-primary); font-size: 0.875rem; cursor: pointer; display: flex; align-items: center; padding: 0; outline: none;"
        >
          <span>{{ showDetails ? '隐藏详情' : '查看详情' }}</span>
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            :style="{ width: '1rem', height: '1rem', marginLeft: '0.25rem', transform: showDetails ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <div
          v-if="showDetails"
          style="margin-top: 0.5rem; padding: 0.75rem; background: var(--color-bg-secondary); border-radius: 0.5rem; border: 1px solid var(--color-border-primary); max-height: 150px; overflow-y: auto;"
        >
          <pre style="margin: 0; font-size: 0.75rem; white-space: pre-wrap; word-break: break-all; color: var(--color-text-secondary); font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">{{ details }}</pre>
        </div>
      </div>

      <!-- 按钮 -->
      <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
        <button
          @click="close"
          :style="buttonStyle"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info', // success, error, warning, info
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  }
})

const showDetails = ref(false)

const emit = defineEmits(['close'])

const close = () => {
  showDetails.value = false
  emit('close')
}

const modalStyle = computed(() => ({
  background: 'var(--color-bg-primary)',
  borderRadius: '0.75rem',
  padding: '2rem',
  maxWidth: '400px',
  width: '100%',
  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  border: '1px solid var(--color-border-primary)'
}))

const iconStyle = computed(() => ({
  width: '3rem',
  height: '3rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: '1rem',
  backgroundColor: props.type === 'success' ? '#10b981' :
                   props.type === 'error' ? '#ef4444' :
                   props.type === 'warning' ? '#f59e0b' : '#6b7280',
  color: 'white'
}))

const titleStyle = computed(() => ({
  fontSize: '1.25rem',
  fontWeight: '600',
  color: 'var(--color-text-primary)',
  margin: 0
}))

const messageStyle = computed(() => ({
  color: 'var(--color-text-secondary)',
  fontSize: '1rem',
  lineHeight: '1.5',
  margin: 0
}))

const buttonStyle = computed(() => ({
  padding: '0.5rem 1.5rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: 'var(--color-accent-primary)',
  color: 'white',
  fontSize: '0.875rem',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'all 0.2s'
}))
</script>