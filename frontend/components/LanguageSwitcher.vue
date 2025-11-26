<template>
  <div class="language-switcher">
    <button
      @click="toggleDropdown"
      class="lang-button"
      :title="currentLocaleName"
    >
      <span class="lang-icon">🌐</span>
      <span class="lang-text">{{ currentLocaleCode }}</span>
      <span class="arrow" :class="{ open: isOpen }">▼</span>
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="dropdown">
        <button
          v-for="locale in supportedLocales"
          :key="locale.code"
          @click="changeLocale(locale.code)"
          class="dropdown-item"
          :class="{ active: locale.code === currentLocale }"
        >
          <span class="checkmark">{{ locale.code === currentLocale ? '✓' : '' }}</span>
          {{ locale.name }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { setLocale, supportedLocales } from '../i18n'

const { locale } = useI18n()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value)

const currentLocaleName = computed(() => {
  const found = supportedLocales.find(l => l.code === currentLocale.value)
  return found ? found.name : 'English'
})

const currentLocaleCode = computed(() => {
  return currentLocale.value
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function changeLocale(newLocale) {
  setLocale(newLocale)
  isOpen.value = false
}

// 点击外部关闭下拉菜单
function handleClickOutside(event) {
  const dropdown = event.target.closest('.language-switcher')
  if (!dropdown && isOpen.value) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.lang-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.lang-button:hover {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
}

.lang-icon {
  font-size: 1.125rem;
}

.lang-text {
  font-weight: 500;
  min-width: 4rem;
  text-align: left;
}

.arrow {
  font-size: 0.625rem;
  transition: transform 0.2s;
  color: var(--color-text-secondary);
}

.arrow.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 10rem;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: var(--color-text);
  cursor: pointer;
  font-size: 0.875rem;
  text-align: left;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: var(--color-bg-hover);
}

.dropdown-item.active {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 500;
}

.checkmark {
  width: 1rem;
  font-weight: bold;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
