<template>
  <div class="social-links-edit-container">
    <div class="social-links-edit-content">
      <h4 class="social-links-edit-title">
        <svg class="social-links-edit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
        </svg>
        {{ $t('social.title') }}
      </h4>
      <div class="social-links-edit-list">
        <div
          v-for="(link, index) in socialLinks"
          :key="index"
          class="social-links-edit-item"
        >
          <select
            :value="link.type"
            @change="$emit('update-type', index, $event.target.value)"
            class="social-links-edit-select"
          >
            <option v-for="type in socialLinkTypes" :key="type.key" :value="type.key">
              {{ $t(type.label) }}
            </option>
          </select>
          <div class="social-links-edit-input-container">
            <!-- GitHub 特殊处理 -->
            <template v-if="getSocialLinkConfig(link.type).useSSLink">
              <input
                :value="link.value"
                @input="$emit('update-value', index, $event.target.value)"
                type="text"
                class="social-links-edit-input"
                :placeholder="$t(getSocialLinkConfig(link.type).placeholder)"
              />
              <div v-if="link.value" class="social-links-edit-github-info">
                <div class="social-links-edit-github-header">
                  <svg class="social-links-edit-github-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span class="social-links-edit-github-title">{{ $t('social.githubInfo') }}</span>
                </div>
                <p class="social-links-edit-github-text">{{ $t('social.username', { value: link.value }) }}</p>
              </div>
            </template>
            <!-- 其他社交媒体链接 -->
            <template v-else>
              <input
                :value="link.value"
                @input="$emit('update-value', index, $event.target.value)"
                type="text"
                class="social-links-edit-input"
                :placeholder="$t(getSocialLinkConfig(link.type).placeholder)"
              />
            </template>
          </div>
          <button
            @click="$emit('remove', index)"
            class="social-links-edit-remove-btn"
          >
            <svg class="social-links-edit-remove-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </button>
        </div>
        <button
          @click="$emit('add')"
          class="social-links-edit-add-btn"
        >
          <svg class="social-links-edit-add-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <span>{{ $t('social.add') }}</span>
        </button>

        <div class="social-links-edit-actions">
          <button
            @click="$emit('save')"
            :disabled="saving"
            class="social-links-edit-save-btn"
          >
            {{ saving ? $t('common.saving') : $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.social-links-edit-container {
  padding: 0 1rem 2rem 1rem;
}

@media (min-width: 768px) {
  .social-links-edit-container {
    padding: 0 2rem 2rem 2rem;
  }
}

.social-links-edit-content {
  background: rgba(249, 250, 251, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 1rem;
  padding: 1rem;
  border: 1px solid rgba(229, 231, 235, 0.8);
}

@media (min-width: 768px) {
  .social-links-edit-content {
    padding: 2rem;
  }
}

.social-links-edit-title {
  font-size: 1rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .social-links-edit-title {
    font-size: 1.25rem;
  }
}

.social-links-edit-icon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.75rem;
  color: #000000;
}

@media (min-width: 768px) {
  .social-links-edit-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}

.social-links-edit-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.social-links-edit-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(229, 231, 235, 0.8);
}

@media (min-width: 768px) {
  .social-links-edit-item {
    flex-direction: row;
    align-items: flex-start;
  }
}

.social-links-edit-select {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  background: white;
  transition: all 0.2s;
  width: 100%;
}

.social-links-edit-select:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

@media (min-width: 768px) {
  .social-links-edit-select {
    min-width: 150px;
    width: auto;
  }
}

.social-links-edit-input-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.social-links-edit-input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;
}

.social-links-edit-input:focus {
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.social-links-edit-github-info {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.social-links-edit-github-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.social-links-edit-github-icon {
  width: 1rem;
  height: 1rem;
  color: #000000;
}

.social-links-edit-github-title {
  font-weight: 600;
  color: #111827;
}

.social-links-edit-github-text {
  margin: 0;
}

.social-links-edit-remove-btn {
  padding: 0.5rem;
  color: #ef4444;
  border-radius: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s;
}

.social-links-edit-remove-btn:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

.social-links-edit-remove-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.social-links-edit-add-btn {
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

.social-links-edit-add-btn:hover {
  border-color: #000000;
  background-color: #f9fafb;
}

.social-links-edit-add-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.social-links-edit-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.social-links-edit-save-btn {
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

.social-links-edit-save-btn:hover {
  background-color: #374151;
  transform: translateY(-1px);
}

.social-links-edit-save-btn:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
  transform: none;
}
</style>

<script setup>
import { socialLinkTypes, getSocialLinkConfig } from '../config/socialLinks'

defineProps({
  socialLinks: {
    type: Array,
    default: () => []
  },
  saving: {
    type: Boolean,
    default: false
  }
})

defineEmits(['add', 'remove', 'update-type', 'update-value', 'save'])
</script>
