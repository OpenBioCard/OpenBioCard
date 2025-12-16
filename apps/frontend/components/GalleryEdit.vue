<template>
  <div class="gallery-edit-container">
    <div class="gallery-edit-content">
      <h4 class="gallery-edit-title">
        <svg class="gallery-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        {{ $t('gallery.manage') }}
      </h4>

      <!-- 图片网格 -->
      <div class="gallery-edit-grid">
        <div
          v-for="(photo, index) in gallery"
          :key="index"
          class="gallery-edit-photo-item"
        >
          <img
            v-if="isBase64Image(photo.image)"
            :src="photo.image"
            class="gallery-edit-photo-image"
          />
          <div v-else class="gallery-edit-photo-placeholder">
            <svg class="gallery-edit-photo-placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>

          <!-- 操作按钮 -->
          <div class="gallery-edit-photo-actions">
            <button
              @click="$emit('remove', index)"
              class="gallery-edit-photo-remove-btn"
            >
              <svg class="gallery-edit-photo-remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>

          <!-- 图片说明输入框 -->
          <div class="gallery-edit-photo-caption">
            <input
              :value="photo.caption"
              @input="$emit('update-caption', index, $event.target.value)"
              type="text"
              :placeholder="$t('gallery.addCaption')"
              class="gallery-edit-photo-caption-input"
            />
          </div>
        </div>

        <!-- 添加照片按钮 -->
        <div
          @click="triggerFileInput"
          class="gallery-edit-add-photo"
        >
          <svg class="gallery-edit-add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span class="gallery-edit-add-text">{{ $t('gallery.add') }}</span>
        </div>
      </div>

      <!-- 隐藏的文件上传输入 -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        multiple
        class="gallery-edit-file-input"
        @change="handleFileUpload"
      />

      <!-- 提示信息 -->
      <div class="gallery-edit-tips">
        <div class="gallery-edit-tips-content">
          <svg class="gallery-edit-tips-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="gallery-edit-tips-text">
            <p class="gallery-edit-tips-paragraph">
              <strong>{{ $t('common.tips') }}</strong>{{ $t('gallery.uploadHelp') }}
            </p>
          </div>
        </div>
      </div>

      <div class="gallery-edit-actions">
        <button
          @click="$emit('save')"
          :disabled="saving"
          class="gallery-edit-save-btn"
        >
          {{ saving ? $t('common.saving') : $t('common.save') }}
        </button>
      </div>
    </div>

    <!-- 通知弹窗 -->
    <NotificationModal
      :show="notificationModal.show"
      :type="notificationModal.type"
      :title="notificationModal.title"
      :message="notificationModal.message"
      @close="closeNotificationModal"
    />
  </div>
</template>

<style scoped>
.gallery-edit-container {
  padding: 0 1rem 2rem 1rem;
}

@media (min-width: 768px) {
  .gallery-edit-container {
    padding: 0 2rem 2rem 2rem;
  }
}

.gallery-edit-content {
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

@media (min-width: 768px) {
  .gallery-edit-content {
    padding: 2rem;
  }
}

.gallery-edit-title {
  font-size: 1rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .gallery-edit-title {
    font-size: 1.25rem;
  }
}

.gallery-edit-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.75rem;
  color: #000000;
}

@media (min-width: 768px) {
  .gallery-edit-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.gallery-edit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .gallery-edit-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}

.gallery-edit-photo-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
}

.gallery-edit-photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-edit-photo-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
}

.gallery-edit-photo-placeholder-icon {
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
}

.gallery-edit-photo-actions {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.gallery-edit-photo-remove-btn {
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  color: white;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gallery-edit-photo-remove-btn:hover {
  background-color: rgba(220, 38, 38, 0.95);
}

.gallery-edit-photo-remove-icon {
  width: 1rem;
  height: 1rem;
}

.gallery-edit-photo-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 1rem 0.75rem 0.75rem;
}

.gallery-edit-photo-caption-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  outline: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  font-size: 0.875rem;
}

.gallery-edit-photo-caption-input:focus {
  border-color: rgba(0, 0, 0, 0.5);
  background-color: rgba(255, 255, 255, 0.95);
}

.gallery-edit-add-photo {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: rgba(255, 255, 255, 0.5);
}

.gallery-edit-add-photo:hover {
  border-color: #000000;
  background-color: rgba(249, 250, 251, 0.8);
}

.gallery-edit-add-icon {
  width: 3rem;
  height: 3rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.gallery-edit-add-text {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.gallery-edit-file-input {
  display: none;
}

.gallery-edit-tips {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-top: 1rem;
}

.gallery-edit-tips-content {
  display: flex;
  align-items: start;
  gap: 0.5rem;
}

.gallery-edit-tips-icon {
  width: 1.25rem;
  height: 1.25rem;
  color: #3b82f6;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.gallery-edit-tips-text {
  flex: 1;
}

.gallery-edit-tips-paragraph {
  color: #1e40af;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.4;
}

.gallery-edit-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.gallery-edit-save-btn {
  padding: 0.75rem 1.5rem;
  background: #000000;
  color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.gallery-edit-save-btn:hover {
  background-color: #374151;
  transform: translateY(-1px);
}

.gallery-edit-save-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}
</style>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NotificationModal from './NotificationModal.vue'

const { t } = useI18n()

defineProps({
  gallery: {
    type: Array,
    default: () => []
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add', 'remove', 'update-caption', 'save'])

const fileInput = ref(null)

// 通知弹窗状态
const notificationModal = ref({
  show: false,
  type: 'info',
  title: '',
  message: ''
})

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

// 关闭通知弹窗
const closeNotificationModal = () => {
  notificationModal.value = {
    show: false,
    type: 'info',
    title: '',
    message: ''
  }
}

// 显示通知弹窗
const showNotification = (type, title, message) => {
  notificationModal.value = {
    show: true,
    type,
    title,
    message
  }
}

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click()
  }
}

const handleFileUpload = (event) => {
  const files = event.target.files
  if (!files || files.length === 0) return

  const validFiles = []
  const errors = []

  // 首先验证所有文件
  Array.from(files).forEach(file => {
    if (file.size > 5 * 1024 * 1024) {
      errors.push(t('gallery.imageTooLarge', { filename: file.name }))
      return
    }

    if (!file.type.startsWith('image/')) {
      errors.push(t('gallery.notImageFile', { filename: file.name }))
      return
    }

    validFiles.push(file)
  })

  // 显示所有错误
  if (errors.length > 0) {
    const errorMessage = errors.join('\n')
    showNotification('error', t('common.tips'), errorMessage)
  }

  // 如果没有有效文件，返回
  if (validFiles.length === 0) {
    event.target.value = ''
    return
  }

  // 限制并发处理数量，避免浏览器卡顿
  const concurrencyLimit = 3
  let processedCount = 0

  const processNextBatch = () => {
    if (processedCount >= validFiles.length) {
      // 清空输入，允许重复上传相同文件
      event.target.value = ''
      return
    }

    const batch = validFiles.slice(processedCount, processedCount + concurrencyLimit)
    processedCount += batch.length

    let completed = 0
    batch.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        emit('add', {
          image: e.target.result,
          caption: ''
        })
        completed++
        if (completed === batch.length) {
          // 当前批次完成，处理下一批次
          setTimeout(processNextBatch, 0)
        }
      }
      reader.onerror = () => {
        showNotification('error', t('common.tips'), `Failed to read file: ${file.name}`)
        completed++
        if (completed === batch.length) {
          setTimeout(processNextBatch, 0)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // 开始处理第一批
  processNextBatch()
}
</script>
