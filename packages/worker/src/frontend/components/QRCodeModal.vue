<template>
  <div
    v-if="show"
    @click="$emit('close')"
    style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.75); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 1rem;"
  >
    <div
      @click.stop
      style="background: var(--color-bg-primary); border-radius: 1rem; padding: 2rem; max-width: 500px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3); position: relative;"
    >
      <!-- 关闭按钮 -->
      <button
        @click="$emit('close')"
        style="position: absolute; top: 1rem; right: 1rem; width: 2.5rem; height: 2.5rem; border-radius: 50%; background: var(--color-bg-tertiary); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;"
        onmouseover="this.style.backgroundColor='var(--color-border-primary)'"
        onmouseout="this.style.backgroundColor='var(--color-bg-tertiary)'"
      >
        <svg style="width: 1.25rem; height: 1.25rem; color: var(--color-text-secondary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- 标题 -->
      <h3 style="font-size: 1.5rem; font-weight: bold; color: var(--color-text-primary); margin-bottom: 1.5rem; text-align: center;">
        {{ label }}
      </h3>

      <!-- 二维码图片 -->
      <div style="display: flex; justify-content: center; align-items: center; background: var(--color-bg-secondary); border-radius: 0.75rem; padding: 2rem; border: 2px solid var(--color-border-primary);">
        <img
          :src="image"
          style="max-width: 100%; height: auto; border-radius: 0.5rem;"
          alt="QR Code"
        />
      </div>

      <!-- 提示文字 -->
      <p style="text-align: center; color: var(--color-text-tertiary); font-size: 0.875rem; margin-top: 1rem; margin-bottom: 0;">
        扫描二维码添加联系方式
      </p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  image: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>
