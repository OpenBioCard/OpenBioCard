<template>
  <!-- 编辑工作经历 -->
  <div class="work-experience-edit">
    <div class="edit-header">
      <svg class="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
      <h3 class="header-title">{{ $t('profile.editWorkExperience') }}</h3>
    </div>
    <div class="action-bar">
      <button
        @click="$emit('add')"
        class="add-button"
      >
        {{ $t('profile.addExperience') }}
      </button>
    </div>
    <div v-if="workExperiences && workExperiences.length > 0" class="experience-list">
      <div v-for="(exp, index) in workExperiences" :key="index" class="experience-item">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">{{ $t('profile.position') }}</label>
            <input
              :value="exp.position"
              @input="$emit('update-position', index, $event.target.value)"
              type="text"
              class="form-input"
              :placeholder="$t('profile.enterPosition')"
            />
          </div>
          <div class="form-group">
            <label class="form-label">{{ $t('profile.company') }}</label>
            <input
              :value="exp.company"
              @input="$emit('update-company', index, $event.target.value)"
              type="text"
              class="form-input"
              :placeholder="$t('profile.enterCompany')"
            />
          </div>
          <div class="form-group full-width">
            <label class="form-label">{{ $t('profile.companyLink') }} <span class="optional-text">({{ $t('common.optional') }})</span></label>
            <input
              :value="exp.companyLink"
              @input="$emit('update-company-link', index, $event.target.value)"
              type="url"
              class="form-input"
              :placeholder="$t('profile.enterCompanyLink')"
            />
          </div>
        </div>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">{{ $t('profile.startDate') }}</label>
            <input
              :value="exp.startDate"
              @input="$emit('update-start-date', index, $event.target.value)"
              type="date"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">{{ $t('profile.endDate') }} <span class="optional-text">({{ $t('common.optional') }})</span></label>
            <input
              :value="exp.endDate"
              @input="$emit('update-end-date', index, $event.target.value)"
              type="date"
              class="form-input"
            />
          </div>
        </div>
        <div class="form-group full-width">
          <label class="form-label">{{ $t('profile.description') }} <span class="optional-text">({{ $t('common.optional') }})</span></label>
          <textarea
            :value="exp.description"
            @input="$emit('update-description', index, $event.target.value)"
            rows="3"
            class="form-textarea"
            :placeholder="$t('profile.enterDescription')"
          ></textarea>
        </div>
        <div class="experience-footer">
          <!-- Logo 上传区域 -->
          <div class="logo-section">
            <label class="form-label">{{ $t('profile.companyLogo') }} <span class="optional-text">({{ $t('common.optional') }})</span></label>
            <div class="logo-upload-wrapper">
              <div v-if="isBase64Image(exp.logo)" class="logo-preview">
                <img :src="exp.logo" class="logo-img" />
              </div>
              <div v-else class="logo-placeholder" @click="$emit('trigger-logo-input', index)">
                <svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <input
                :ref="(el) => $emit('set-logo-input-ref', el, index)"
                type="file"
                accept="image/*"
                class="hidden-input"
                @change="(e) => $emit('upload-logo', e, index)"
              />
              <div class="logo-actions">
                <button
                  type="button"
                  @click="$emit('trigger-logo-input', index)"
                  class="logo-button upload"
                >
                  {{ exp.logo ? $t('profile.changeLogo') : $t('profile.uploadLogo') }}
                </button>
                <button
                  v-if="exp.logo"
                  type="button"
                  @click="$emit('remove-logo', index)"
                  class="logo-button remove"
                >
                  {{ $t('profile.removeLogo') }}
                </button>
              </div>
            </div>
          </div>

          <!-- 删除按钮 -->
          <div class="remove-action">
            <button
              type="button"
              @click="$emit('remove', index)"
              class="remove-button"
            >
              <svg class="remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.work-experience-edit {
  padding: 2rem;
  border-top: 1px solid var(--color-border-tertiary);
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.header-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary);
}

.header-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--color-text-primary);
}

.action-bar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
}

.add-button {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
}

.add-button:hover {
  background-color: var(--color-primary-hover);
}

.experience-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.experience-item {
  padding: 1.5rem;
  background: var(--color-bg-secondary);
  border-radius: 0.75rem;
  border: 1px solid var(--color-border-tertiary);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.optional-text {
  font-weight: normal;
  color: var(--color-text-tertiary);
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-border-secondary);
  border-radius: 0.375rem;
  outline: none;
  transition: all 0.2s;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.form-textarea {
  resize: vertical;
}

.form-input:focus, .form-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-focus);
}

.experience-footer {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  margin-top: 1rem;
}

.logo-section {
  flex: 1;
}

.logo-upload-wrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-preview {
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid var(--color-border-primary);
  flex-shrink: 0;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.logo-placeholder {
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;
  background: var(--color-bg-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed var(--color-border-secondary);
  cursor: pointer;
  flex-shrink: 0;
}

.placeholder-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-text-tertiary);
}

.hidden-input {
  display: none;
}

.logo-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.logo-button {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.75rem;
  font-weight: 500;
  border: 1px solid transparent;
}

.logo-button.upload {
  background: var(--color-bg-tertiary);
  border-color: var(--color-border-secondary);
  color: var(--color-text-secondary);
}

.logo-button.upload:hover {
  background-color: var(--color-border-primary);
}

.logo-button.remove {
  background: var(--color-danger-bg);
  border-color: var(--color-danger-light);
  color: var(--color-danger);
}

.logo-button.remove:hover {
  background-color: var(--color-danger-light);
}

.remove-action {
  flex-shrink: 0;
}

.remove-button {
  padding: 0.5rem;
  background: var(--color-danger-bg);
  color: var(--color-danger);
  border: 1px solid var(--color-danger-light);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-button:hover {
  background-color: var(--color-danger-light);
}

.remove-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* 响应式适配 */
@media (max-width: 640px) {
  .work-experience-edit {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: auto;
  }

  .experience-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .logo-upload-wrapper {
    flex-wrap: wrap;
  }

  .logo-actions {
    flex-direction: row;
    flex: 1;
  }

  .logo-button {
    flex: 1;
    text-align: center;
  }

  .remove-action {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  .remove-button {
    width: 100%;
  }
}
</style>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  workExperiences: {
    type: Array,
    default: () => []
  },
  saving: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'add',
  'remove',
  'update-position',
  'update-company',
  'update-company-link',
  'update-start-date',
  'update-end-date',
  'update-description',
  'set-logo-input-ref',
  'trigger-logo-input',
  'upload-logo',
  'remove-logo',
  'save'
])

// 检查是否为base64图片
const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}
</script>