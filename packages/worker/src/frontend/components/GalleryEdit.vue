<template>
  <div style="padding: 0 2rem 2rem 2rem;">
    <div style="background: rgba(249, 250, 251, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 1rem; padding: 2rem; border: 1px solid rgba(229, 231, 235, 0.8);">
      <h4 style="font-size: 1.25rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
        <svg style="width: 1.25rem; height: 1.25rem; margin-right: 0.75rem; color: #000000;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        {{ $t('gallery.manage') }}
      </h4>

      <!-- 图片网格 -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
        <div
          v-for="(photo, index) in gallery"
          :key="index"
          style="position: relative; aspect-ratio: 1; border-radius: 0.75rem; overflow: hidden; background: #f3f4f6; border: 2px solid #e5e7eb;"
        >
          <img
            v-if="isBase64Image(photo.image)"
            :src="photo.image"
            style="width: 100%; height: 100%; object-fit: cover;"
          />
          <div v-else style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #f3f4f6;">
            <svg style="width: 3rem; height: 3rem; color: #9ca3af;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>

          <!-- 操作按钮 -->
          <div style="position: absolute; top: 0.5rem; right: 0.5rem; display: flex; gap: 0.5rem;">
            <button
              @click="$emit('remove', index)"
              style="padding: 0.5rem; background: rgba(239, 68, 68, 0.9); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); color: white; border-radius: 0.5rem; border: none; cursor: pointer; transition: all 0.2s; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);"
              onmouseover="this.style.backgroundColor='rgba(220, 38, 38, 0.95)'"
              onmouseout="this.style.backgroundColor='rgba(239, 68, 68, 0.9)'"
            >
              <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

          <!-- 图片说明输入框 -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent); padding: 1rem 0.75rem 0.75rem;">
            <input
              :value="photo.caption"
              @input="$emit('update-caption', index, $event.target.value)"
              type="text"
              :placeholder="$t('gallery.addCaption')"
              style="width: 100%; padding: 0.5rem; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 0.5rem; outline: none; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); font-size: 0.875rem;"
              onfocus="this.style.borderColor='rgba(0, 0, 0, 0.5)'; this.style.backgroundColor='rgba(255, 255, 255, 0.95)'"
              onblur="this.style.borderColor='rgba(255, 255, 255, 0.3)'; this.style.backgroundColor='rgba(255, 255, 255, 0.9)'"
            />
          </div>
        </div>

        <!-- 添加照片按钮 -->
        <div
          @click="triggerFileInput"
          style="aspect-ratio: 1; border: 2px dashed #d1d5db; border-radius: 0.75rem; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; background: rgba(255, 255, 255, 0.5);"
          onmouseover="this.style.borderColor='#000000'; this.style.backgroundColor='rgba(249, 250, 251, 0.8)'"
          onmouseout="this.style.borderColor='#d1d5db'; this.style.backgroundColor='rgba(255, 255, 255, 0.5)'"
        >
          <svg style="width: 3rem; height: 3rem; color: #9ca3af; margin-bottom: 0.5rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span style="color: #6b7280; font-size: 0.875rem; font-weight: 500;">{{ $t('gallery.add') }}</span>
        </div>
      </div>

      <!-- 隐藏的文件上传输入 -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        style="display: none;"
        @change="handleFileUpload"
      />

      <!-- 提示信息 -->
      <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 0.5rem; padding: 0.75rem 1rem; margin-top: 1rem;">
        <div style="display: flex; align-items: start; gap: 0.5rem;">
          <svg style="width: 1.25rem; height: 1.25rem; color: #3b82f6; flex-shrink: 0; margin-top: 0.125rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div style="flex: 1;">
            <p style="color: #1e40af; font-size: 0.875rem; margin: 0; line-height: 1.4;">
              <strong>{{ $t('common.tips') }}</strong>{{ $t('gallery.uploadHelp') }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  gallery: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['add', 'remove', 'update-caption'])

const fileInput = ref(null)

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  Array.from(files).forEach(file => {
    if (file.size > 2 * 1024 * 1024) {
      alert(t('gallery.imageTooLarge', { filename: file.name }))
      return
    }

    if (!file.type.startsWith('image/')) {
      alert(t('gallery.notImageFile', { filename: file.name }))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      emit('add', {
        image: e.target.result,
        caption: ''
      })
    }
    reader.readAsDataURL(file)
  })

  // 清空输入，允许重复上传相同文件
  event.target.value = ''
}
</script>
