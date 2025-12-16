<template>
  <!-- 編輯學校經歷 -->
  <div style="padding: 2rem; border-top: 1px solid var(--color-border-tertiary);">
    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem;">
      <svg style="width: 1.5rem; height: 1.5rem; color: var(--color-primary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
      </svg>
      <h3 style="font-size: 1.25rem; font-weight: bold; color: var(--color-text-primary);">{{ $t('profile.editSchoolExperience') }}</h3>
    </div>
    <div style="display: flex; justify-content: flex-start; margin-bottom: 1.5rem;">
      <button
        @click="$emit('add')"
        style="padding: 0.5rem 1rem; background: var(--color-primary); color: var(--color-text-inverse); border: none; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; font-size: 0.875rem; font-weight: 500;"
        onmouseover="this.style.backgroundColor='var(--color-primary-hover)'"
        onmouseout="this.style.backgroundColor='var(--color-primary)'"
      >
        {{ $t('profile.addSchoolExperience') }}
      </button>
    </div>
    <div v-if="schoolExperiences && schoolExperiences.length > 0" style="display: flex; flex-direction: column; gap: 1.5rem;">
      <div v-for="(exp, index) in schoolExperiences" :key="index" style="padding: 1.5rem; background: var(--color-bg-secondary); border-radius: 0.75rem; border: 1px solid var(--color-border-tertiary);">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary);">{{ $t('profile.degree') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
            <input
              :value="exp.degree"
              @input="$emit('update-degree', index, $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border-secondary); border-radius: 0.375rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary); font-size: 0.875rem;"
              :placeholder="$t('profile.enterDegree')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary);">{{ $t('profile.school') }}</label>
            <input
              :value="exp.school"
              @input="$emit('update-school', index, $event.target.value)"
              type="text"
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border-secondary); border-radius: 0.375rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary); font-size: 0.875rem;"
              :placeholder="$t('profile.enterSchool')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary);">{{ $t('profile.schoolLink') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
            <input
              :value="exp.schoolLink"
              @input="$emit('update-school-link', index, $event.target.value)"
              type="url"
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border-secondary); border-radius: 0.375rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary); font-size: 0.875rem;"
              :placeholder="$t('profile.enterSchoolLink')"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
          <label style="font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary);">{{ $t('profile.major') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
          <input
            :value="exp.major"
            @input="$emit('update-major', index, $event.target.value)"
            type="text"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border-secondary); border-radius: 0.375rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary); font-size: 0.875rem;"
            :placeholder="$t('profile.enterMajor')"
            onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
            onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
          />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary);">{{ $t('profile.startDate') }}</label>
            <input
              :value="exp.startDate"
              @input="$emit('update-start-date', index, $event.target.value)"
              type="date"
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border-secondary); border-radius: 0.375rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary); font-size: 0.875rem;"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <label style="font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary);">{{ $t('profile.endDate') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
            <input
              :value="exp.endDate"
              @input="$emit('update-end-date', index, $event.target.value)"
              type="date"
              style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border-secondary); border-radius: 0.375rem; outline: none; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary); font-size: 0.875rem;"
              onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
              onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
            />
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
          <label style="font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary);">{{ $t('profile.description') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
          <textarea
            :value="exp.description"
            @input="$emit('update-description', index, $event.target.value)"
            rows="3"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--color-border-secondary); border-radius: 0.375rem; outline: none; resize: vertical; transition: all 0.2s; background: var(--color-bg-primary); color: var(--color-text-primary); font-size: 0.875rem;"
            :placeholder="$t('profile.enterDescription')"
            onfocus="this.style.borderColor='var(--color-primary)'; this.style.boxShadow='var(--shadow-focus)'"
            onblur="this.style.borderColor='var(--color-border-secondary)'; this.style.boxShadow='none'"
          ></textarea>
        </div>
        <div style="display: flex; gap: 1rem; align-items: flex-start;">
          <!-- Logo 上传区域 -->
          <div style="flex-shrink: 0;">
            <label style="font-size: 0.75rem; font-weight: 500; color: var(--color-text-secondary); display: block; margin-bottom: 0.5rem;">{{ $t('profile.schoolLogo') }} <span style="font-weight: normal; color: var(--color-text-tertiary);">({{ $t('common.optional') }})</span></label>
            <div v-if="isBase64Image(exp.logo)" style="width: 4rem; height: 4rem; border-radius: 0.5rem; overflow: hidden; border: 2px solid var(--color-border-primary);">
              <img :src="exp.logo" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div v-else style="width: 4rem; height: 4rem; border-radius: 0.5rem; background: var(--color-bg-tertiary); display: flex; align-items: center; justify-content: center; border: 2px dashed var(--color-border-secondary); cursor: pointer;" @click="$emit('trigger-logo-input', index)">
              <svg style="width: 1.5rem; height: 1.5rem; color: var(--color-text-tertiary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <input
              :ref="(el) => $emit('set-logo-input-ref', el, index)"
              type="file"
              accept="image/*"
              style="display: none;"
              @change="(e) => $emit('upload-logo', e, index)"
            />
            <div style="display: flex; gap: 0.25rem; margin-top: 0.5rem;">
              <button
                type="button"
                @click="$emit('trigger-logo-input', index)"
                style="flex: 1; padding: 0.375rem 0.5rem; background: var(--color-bg-tertiary); border: 1px solid var(--color-border-secondary); border-radius: 0.375rem; cursor: pointer; transition: all 0.2s; font-size: 0.75rem; color: var(--color-text-secondary);"
                onmouseover="this.style.backgroundColor='var(--color-border-primary)'"
                onmouseout="this.style.backgroundColor='var(--color-bg-tertiary)'"
              >
                {{ exp.logo ? $t('profile.changeLogo') : $t('profile.uploadLogo') }}
              </button>
              <button
                v-if="exp.logo"
                type="button"
                @click="$emit('remove-logo', index)"
                style="padding: 0.375rem 0.5rem; background: var(--color-danger-bg); border: 1px solid var(--color-danger-light); border-radius: 0.375rem; cursor: pointer; transition: all 0.2s; font-size: 0.75rem; color: var(--color-danger);"
                onmouseover="this.style.backgroundColor='var(--color-danger-light)'"
                onmouseout="this.style.backgroundColor='var(--color-danger-bg)'"
              >
                {{ $t('profile.removeLogo') }}
              </button>
            </div>
          </div>

          <!-- 删除按钮 -->
          <div style="margin-left: auto; padding-top: 1.75rem;">
            <button
              type="button"
              @click="$emit('remove', index)"
              style="padding: 0.5rem; background: var(--color-danger-bg); color: var(--color-danger); border: 1px solid var(--color-danger-light); border-radius: 0.5rem; cursor: pointer; transition: all 0.2s;"
              onmouseover="this.style.backgroundColor='var(--color-danger-light)'"
              onmouseout="this.style.backgroundColor='var(--color-danger-bg)'"
            >
              <svg style="width: 1.25rem; height: 1.25rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
      <button
        @click="$emit('save')"
        :disabled="saving"
        style="padding: 0.75rem 1.5rem; background: #000000; color: #ffffff; border: none; border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; font-weight: 500; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);"
        onmouseover="this.style.backgroundColor='#374151'; this.style.transform='translateY(-1px)'"
        onmouseout="this.style.backgroundColor='#000000'; this.style.transform='translateY(0)'"
      >
        {{ saving ? $t('common.saving') : $t('common.save') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  schoolExperiences: {
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
  'update-degree',
  'update-school',
  'update-school-link',
  'update-major',
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