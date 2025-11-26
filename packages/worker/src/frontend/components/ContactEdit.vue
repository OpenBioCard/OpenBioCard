<template>
  <div style="padding: 0 2rem 2rem 2rem;">
    <div style="background: rgba(249, 250, 251, 0.8); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); border-radius: 1rem; padding: 2rem; border: 1px solid rgba(229, 231, 235, 0.8);">
      <h4 style="font-size: 1.25rem; font-weight: bold; color: #111827; margin-bottom: 1.5rem; display: flex; align-items: center;">
        <svg style="width: 1.25rem; height: 1.25rem; margin-right: 0.75rem; color: #000000;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        {{ $t('contact.manage') }}
      </h4>
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div
          v-for="(contact, index) in contacts"
          :key="index"
          style="display: flex; align-items: center; gap: 1rem; background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); border-radius: 0.75rem; padding: 1rem; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); border: 1px solid rgba(229, 231, 235, 0.8);"
        >
          <select
            :value="contact.type"
            @change="$emit('update-type', index, $event.target.value)"
            style="padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; background: white; transition: all 0.2s;"
            onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
            onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
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
          <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
            <template v-if="getContactInputConfig(contact.type).type === 'file'">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div v-if="isBase64Image(contact.value)" style="width: 3rem; height: 3rem; border-radius: 0.5rem; overflow: hidden; border: 2px solid #e5e7eb; flex-shrink: 0;">
                  <img :src="contact.value" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  :data-input-index="index"
                  style="position: absolute; opacity: 0; width: 0; height: 0;"
                  @change="(e) => $emit('upload-qrcode', e, index)"
                />
                <button
                  type="button"
                  @click="triggerFileInput(index)"
                  style="flex: 1; padding: 0.5rem 1rem; border: 2px dashed #d1d5db; border-radius: 0.5rem; background: #f9fafb; cursor: pointer; transition: all 0.2s; text-align: center; font-size: 0.875rem; color: #374151; font-weight: 500; display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                  onmouseover="this.style.borderColor='#000000'; this.style.backgroundColor='#f3f4f6'"
                  onmouseout="this.style.borderColor='#d1d5db'; this.style.backgroundColor='#f9fafb'"
                >
                  <svg style="width: 1rem; height: 1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                style="width: 100%; padding: 0.5rem 1rem; border: 1px solid #d1d5db; border-radius: 0.5rem; outline: none; transition: all 0.2s;"
                :placeholder="getContactInputConfig(contact.type).placeholder"
                onfocus="this.style.borderColor='#000000'; this.style.boxShadow='0 0 0 3px rgba(0, 0, 0, 0.1)'"
                onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
              />
            </template>
          </div>
          <button
            @click="$emit('remove', index)"
            style="padding: 0.5rem; color: #ef4444; border-radius: 0.5rem; border: none; background: transparent; cursor: pointer; transition: all 0.2s;"
            onmouseover="this.style.backgroundColor='#fef2f2'; this.style.color='#dc2626'"
            onmouseout="this.style.backgroundColor='transparent'; this.style.color='#ef4444'"
          >
            <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
        <button
          @click="$emit('add')"
          style="width: 100%; padding: 1rem; border: 2px dashed #d1d5db; border-radius: 0.75rem; color: #000000; background: transparent; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-weight: 500;"
          onmouseover="this.style.borderColor='#000000'; this.style.backgroundColor='#f9fafb'"
          onmouseout="this.style.borderColor='#d1d5db'; this.style.backgroundColor='transparent'"
        >
          <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>{{ $t('contact.add') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  contacts: {
    type: Array,
    default: () => []
  }
})

defineEmits(['add', 'remove', 'update-type', 'update-value', 'upload-qrcode'])

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
