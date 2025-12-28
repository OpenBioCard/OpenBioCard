<template>
  <div class="projects-edit-container">
    <div class="projects-edit-card">
      <h4 class="projects-edit-title">
        <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        {{ $t('projects.manage') }}
      </h4>
      <div class="projects-list">
        <div
          v-for="(project, index) in projects"
          :key="index"
          class="project-item"
        >
          <div class="project-item-content">
            <!-- Logo 上传区域 -->
            <div class="logo-section">
              <div v-if="isBase64Image(project.logo)" class="logo-preview">
                <img :src="project.logo" class="logo-img" />
              </div>
              <div v-else class="logo-placeholder">
                <svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                type="file"
                accept="image/*"
                :data-logo-index="index"
                class="hidden-input"
                @change="(e) => $emit('upload-logo', e, index)"
              />
              <button
                type="button"
                @click="triggerLogoInput(index)"
                class="upload-button"
              >
                {{ isBase64Image(project.logo) ? $t('projects.changeLogo') : $t('projects.uploadLogo') }}
              </button>
            </div>

            <!-- 项目信息编辑 -->
            <div class="info-section">
              <input
                :value="project.name"
                @input="$emit('update-name', index, $event.target.value)"
                type="text"
                :placeholder="$t('projects.name')"
                class="name-input"
              />
              <input
                :value="project.url"
                @input="$emit('update-url', index, $event.target.value)"
                type="text"
                :placeholder="$t('projects.url')"
                class="url-input"
              />
              <textarea
                :value="project.description"
                @input="$emit('update-description', index, $event.target.value)"
                :placeholder="$t('projects.description')"
                rows="3"
                class="desc-textarea"
              ></textarea>
            </div>

            <!-- 删除按钮 -->
            <button
              @click="$emit('remove', index)"
              class="remove-button"
            >
              <svg class="remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- 添加项目按钮 -->
        <button
          @click="$emit('add')"
          class="add-button"
        >
          <svg class="add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>{{ $t('projects.add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects-edit-container {
  padding: 0 2rem 2rem 2rem;
}

.projects-edit-card {
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

.projects-edit-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

.title-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
  color: #000000;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.project-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.8);
}

.project-item-content {
  display: flex;
  gap: 1rem;
}

.logo-section {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo-preview {
  width: 5rem;
  height: 5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-placeholder {
  width: 5rem;
  height: 5rem;
  border-radius: 0.75rem;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d1d5db;
}

.placeholder-icon {
  width: 2rem;
  height: 2rem;
  color: #9ca3af;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.upload-button {
  width: 5rem;
  margin-top: 0.5rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  color: #374151;
}

.upload-button:hover {
  border-color: #000000;
  background-color: #f3f4f6;
}

.info-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-width: 0; /* 防止 flex 子元素溢出 */
}

.name-input, .url-input, .desc-textarea {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;
  background: white;
}

.name-input {
  font-weight: 600;
}

.desc-textarea {
  resize: vertical;
  font-family: inherit;
}

.name-input:focus, .url-input:focus, .desc-textarea:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.remove-button {
  padding: 0.5rem;
  color: #ef4444;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  height: fit-content;
  flex-shrink: 0;
}

.remove-button:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.remove-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.add-button {
  width: 100%;
  padding: 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.75rem;
  color: #000000;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
}

.add-button:hover {
  border-color: #000000;
  background-color: #f9fafb;
}

.add-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .projects-edit-container {
    padding: 0 1rem 1rem 1rem;
  }

  .projects-edit-card {
    padding: 1.25rem;
  }

  .project-item {
    padding: 1.25rem;
  }

  .project-item-content {
    flex-direction: column;
    position: relative;
    gap: 1.25rem;
  }

  .logo-section {
    flex-direction: row;
    gap: 1.25rem;
    align-items: center;
    width: 100%;
  }

  .logo-preview, .logo-placeholder {
    width: 4.5rem;
    height: 4.5rem;
  }

  .upload-button {
    margin-top: 0;
    flex: 1;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-button {
    position: static;
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.625rem;
    background: #fef2f2;
    border: 1px solid #fee2e2;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: none;
  }

  .info-section {
    width: 100%;
    gap: 0.75rem;
  }

  .name-input, .url-input, .desc-textarea {
    font-size: 0.9375rem;
    padding: 0.625rem 0.875rem;
  }
}
</style>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  projects: {
    type: Array,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add', 'remove', 'update-name', 'update-url', 'update-description', 'upload-logo', 'save'])

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const triggerLogoInput = (index) => {
  const input = document.querySelector(`input[data-logo-index="${index}"]`)
  if (input) {
    input.click()
  }
}
</script>
