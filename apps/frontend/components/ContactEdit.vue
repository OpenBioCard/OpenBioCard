<template>
  <div class="contact-edit-container">
    <div class="contact-edit-content">
      <h4 class="contact-edit-title">
        <svg class="contact-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        {{ $t('contact.manage') }}
      </h4>
      <div class="contact-edit-list">
        <div
          v-for="(contact, index) in contacts"
          :key="index"
          class="contact-edit-item"
        >
          <select
            :value="contact.type"
            @change="$emit('update-type', index, $event.target.value)"
            class="contact-edit-select"
          >
            <option value="email">{{ $t('contact.types.email') }}</option>
            <option value="phone">{{ $t('contact.types.phone') }}</option>
            <option value="wechat">{{ $t('contact.types.wechat') }}</option>
            <option value="qq">{{ $t('contact.types.qq') }}</option>
            <option value="whatsapp">{{ $t('contact.types.whatsapp') }}</option>
            <option value="telegram">{{ $t('contact.types.telegram') }}</option>
            <option value="discord">{{ $t('contact.types.discord') }}</option>
            <option value="line">{{ $t('contact.types.line') }}</option>
            <option value="wecom">{{ $t('contact.types.wechat_work') }}</option>
          </select>
          <div class="contact-edit-input-container">
            <template v-if="getContactInputConfig(contact.type).type === 'file'">
              <div class="contact-edit-file-container">
                <div v-if="isBase64Image(contact.value)" class="contact-edit-qr-preview">
                  <img :src="contact.value" class="contact-edit-qr-image" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  :data-input-index="index"
                  class="contact-edit-file-input"
                  @change="(e) => $emit('upload-qrcode', e, index)"
                />
                <button
                  type="button"
                  @click="triggerFileInput(index)"
                  class="contact-edit-upload-btn"
                >
                  <svg class="contact-edit-upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <span>{{ isBase64Image(contact.value) ? $t('contact.changeQRCode') : $t('contact.uploadQRCode') }}</span>
                </button>
              </div>
            </template>
            <template v-else>
              <input
                :value="contact.value"
                @input="$emit('update-value', index, $event.target.value)"
                type="text"
                class="contact-edit-input"
                :placeholder="getContactInputConfig(contact.type).placeholder"
              />
            </template>
          </div>
          <button
            @click="$emit('remove', index)"
            class="contact-edit-remove-btn"
          >
            <svg class="contact-edit-remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
        <button
          @click="$emit('add')"
          class="contact-edit-add-btn"
        >
          <svg class="contact-edit-add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>{{ $t('contact.add') }}</span>
        </button>
        <div class="contact-edit-actions">
          <button
            @click="$emit('save')"
            :disabled="saving"
            class="contact-edit-save-btn"
          >
            {{ saving ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-edit-container {
  padding: 0 1rem 2rem 1rem;
}

@media (min-width: 768px) {
  .contact-edit-container {
    padding: 0 2rem 2rem 2rem;
  }
}

.contact-edit-content {
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

@media (min-width: 768px) {
  .contact-edit-content {
    padding: 2rem;
  }
}

.contact-edit-title {
  font-size: 1rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .contact-edit-title {
    font-size: 1.25rem;
  }
}

.contact-edit-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.75rem;
  color: #000000;
}

@media (min-width: 768px) {
  .contact-edit-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.contact-edit-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-edit-item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.8);
}

@media (min-width: 768px) {
  .contact-edit-item {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
  }
}

.contact-edit-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  background: white;
  transition: all 0.2s;
  width: 100%;
}

.contact-edit-select:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .contact-edit-select {
    min-width: 150px;
    width: auto;
  }
}

.contact-edit-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-edit-file-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-edit-qr-preview {
  width: 3rem;
  height: 3rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  flex-shrink: 0;
}

.contact-edit-file-input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.contact-edit-upload-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  font-size: 0.875rem;
  color: #374151;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.contact-edit-upload-btn:hover {
  border-color: #000000;
  background-color: #f3f4f6;
}

.contact-edit-upload-icon {
  width: 1rem;
  height: 1rem;
}

.contact-edit-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;
}

.contact-edit-input:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.contact-edit-remove-btn {
  padding: 0.5rem;
  color: #ef4444;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
}

.contact-edit-remove-btn:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

@media (min-width: 768px) {
  .contact-edit-remove-btn {
    align-self: center;
  }
}

.contact-edit-remove-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.contact-edit-add-btn {
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

.contact-edit-add-btn:hover {
  border-color: #000000;
  background-color: #f9fafb;
}

.contact-edit-add-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.contact-edit-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.contact-edit-save-btn {
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

.contact-edit-save-btn:hover {
  background-color: #374151;
  transform: translateY(-1px);
}

.contact-edit-save-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}
</style>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  contacts: {
    type: Array,
    required: true
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['add', 'remove', 'update-type', 'update-value', 'upload-qrcode', 'save'])

const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

const getContactInputConfig = (type) => {
  const configs = {
    email: { type: 'text', placeholder: t('contact.placeholders.email') },
    phone: { type: 'text', placeholder: t('contact.placeholders.phone') },
    wechat: { type: 'text', placeholder: t('contact.placeholders.wechat') },
    qq: { type: 'text', placeholder: t('contact.placeholders.qq') },
    whatsapp: { type: 'text', placeholder: t('contact.placeholders.whatsapp') },
    telegram: { type: 'text', placeholder: t('contact.placeholders.telegram') },
    discord: { type: 'text', placeholder: t('contact.placeholders.discord') },
    line: { type: 'file', placeholder: t('contact.placeholders.line') },
    wecom: { type: 'file', placeholder: t('contact.placeholders.wechat_work') }
  }
  return configs[type] || { type: 'text', placeholder: t('contact.placeholders.email') }
}

const triggerFileInput = (index) => {
  const input = document.querySelector(`input[data-input-index="${index}"]`)
  if (input) {
    input.click()
  }
}
</script>
