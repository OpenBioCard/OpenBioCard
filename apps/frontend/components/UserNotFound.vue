<template>
  <div style="max-width: 1152px; margin: 0 auto; padding: 4rem 1rem; text-align: center;">
    <div style="background: var(--color-bg-overlay); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 1rem; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border-tertiary); padding: 4rem 2rem;">
      <div style="width: 6rem; height: 6rem; background: var(--color-bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;">
        <svg style="width: 3rem; height: 3rem; color: var(--color-text-tertiary);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      </div>
      <h1 style="font-size: 3rem; font-weight: bold; color: var(--color-text-primary); margin: 0 0 1rem;">404</h1>
      <p style="font-size: 1.25rem; color: var(--color-text-tertiary); margin: 0 0 2rem;">{{ $t('error.userNotFound') }}</p>
      <p style="color: var(--color-text-tertiary); margin: 0 0 2rem;">{{ $t('error.userNotFoundMessage', { username }) }}</p>
      <a
        href="/"
        style="display: inline-block; padding: 0.75rem 1.5rem; background: var(--color-primary); color: var(--color-text-inverse); border-radius: 0.5rem; text-decoration: none; transition: background-color 0.2s; font-weight: 500;"
        onmouseover="this.style.backgroundColor='var(--color-primary-hover)'"
        onmouseout="this.style.backgroundColor='var(--color-primary)'"
      >
        {{ $t('error.goBackHome') }}
      </a>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps({
  username: {
    type: String,
    required: true
  }
})
</script>