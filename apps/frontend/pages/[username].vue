<template>
  <div style="min-height: 100vh; background: var(--gradient-bg);">
    <!-- 导航栏 -->
    <Navigation :current-user="currentUser" :site-settings="settings" @logout="logout" />

    <!-- 404 页面 -->
    <UserNotFound v-if="userNotFound" :username="username" />

    <!-- 主要内容 -->
    <main v-else style="max-width: 1152px; margin: 0 auto; padding: 2rem 1rem;">
      <div style="background: var(--color-bg-overlay); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 1rem; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border-tertiary); overflow: hidden;">
        <!-- 资料头部 -->
        <ProfileHeader
          :profile-data="displayProfileData"
          :can-edit="canEdit"
          :site-settings="settings"
          @toggle-edit="editMode = !editMode"
        />

        <!-- 编辑模式 -->
        <div v-if="editMode && canEdit" style="padding: 0 2rem; margin-top: 2rem; margin-bottom: -1rem; display: flex; justify-content: flex-end;">
           <div style="display: flex; align-items: center; gap: 0.5rem;">
             <label style="font-weight: 600; font-size: 0.875rem; color: var(--color-text-secondary);">Editing Language:</label>
             <select v-model="currentEditLang" style="padding: 0.25rem 0.5rem; border-radius: 0.375rem; border: 1px solid var(--color-border-secondary); background: var(--color-bg-primary); color: var(--color-text-primary);">
               <option value="default">{{ $t('common.default') || 'Default' }}</option>
               <option v-for="l in supportedLocales" :key="l.code" :value="l.code">{{ l.name }}</option>
             </select>
           </div>
        </div>

        <ProfileEditForm
          v-if="editMode && canEdit"
          :edit-data="activeEditData"
          :username="username"
          :saving="savingProfileHeader"
          @save="saveProfileHeader"
          @cancel="cancelEdit"
          @update:name="updateEditField('name', $event)"
          @update:userType="updateEditField('userType', $event)"
          @update:pronouns="updateEditField('pronouns', $event)"
          @update:avatar="updateEditField('avatar', $event)"
          @update:bio="updateEditField('bio', $event)"
          @update:background="updateEditField('background', $event)"
          @update:location="updateEditField('location', $event)"
          @update:website="updateEditField('website', $event)"
          @update:currentCompany="updateEditField('currentCompany', $event)"
          @update:currentCompanyLink="updateEditField('currentCompanyLink', $event)"
          @update:currentSchool="updateEditField('currentSchool', $event)"
          @update:currentSchoolLink="updateEditField('currentSchoolLink', $event)"
          @update:workExperiences="editData.workExperiences = $event"
          @export-data="handleExportData"
          @import-data="handleImportData"
        />

        <!-- 联系方式列表 -->
        <ContactList
          :contacts="profileData.contacts"
          @contact-click="handleContactClick"
        />

        <!-- 编辑联系方式 -->
        <ContactEdit
          v-if="editMode && canEdit"
          :contacts="editData.contacts"
          :saving="savingContacts"
          @add="addContact"
          @remove="removeContact"
          @update-type="updateContactType"
          @update-value="updateContactValue"
          @upload-qrcode="handleContactUpload"
          @save="saveContacts"
        />

        <!-- 社交媒体链接列表 -->
        <SocialLinksList
          :social-links="profileData.socialLinks"
        />

        <!-- 编辑社交媒体链接 -->
        <SocialLinksEdit
          v-if="editMode && canEdit"
          :social-links="editData.socialLinks"
          :saving="savingSocialLinks"
          @add="addSocialLink"
          @remove="removeSocialLink"
          @update-type="updateSocialLinkType"
          @update-value="updateSocialLinkValue"
          @save="saveSocialLinks"
        />

        <!-- 项目列表 -->
        <ProjectsList
          :projects="profileData.projects"
        />

        <!-- 编辑项目 -->
        <ProjectsEdit
          v-if="editMode && canEdit"
          :projects="editData.projects"
          :saving="savingProjects"
          @add="addProject"
          @remove="removeProject"
          @update-name="updateProjectName"
          @update-url="updateProjectUrl"
          @update-description="updateProjectDescription"
          @upload-logo="handleProjectLogoUpload"
          @save="saveProjects"
        />

        <!-- 工作经历列表 -->
        <WorkExperience :work-experiences="profileData.workExperiences" />

        <!-- 编辑工作经历 -->
        <WorkExperienceEdit
          v-if="editMode && canEdit"
          :work-experiences="editData.workExperiences"
          :saving="savingWork"
          @add="addWorkExperience"
          @remove="removeWorkExperience"
          @update-position="(index, value) => updateWorkExperience(index, 'position', value)"
          @update-company="(index, value) => updateWorkExperience(index, 'company', value)"
          @update-company-link="(index, value) => updateWorkExperience(index, 'companyLink', value)"
          @update-start-date="(index, value) => updateWorkExperience(index, 'startDate', value)"
          @update-end-date="(index, value) => updateWorkExperience(index, 'endDate', value)"
          @update-description="(index, value) => updateWorkExperience(index, 'description', value)"
          @set-logo-input-ref="setWorkLogoInputRef"
          @trigger-logo-input="triggerWorkLogoInput"
          @upload-logo="handleWorkLogoUpload"
          @remove-logo="removeWorkLogo"
          @save="saveWorkExperience"
        />

        <!-- 学校经历列表 -->
        <SchoolExperience :school-experiences="profileData.schoolExperiences" />

        <!-- 编辑学校经历 -->
        <SchoolExperienceEdit
          v-if="editMode && canEdit"
          :school-experiences="editData.schoolExperiences"
          :saving="savingSchool"
          @add="addSchoolExperience"
          @remove="removeSchoolExperience"
          @update-degree="(index, value) => updateSchoolExperience(index, 'degree', value)"
          @update-school="(index, value) => updateSchoolExperience(index, 'school', value)"
          @update-school-link="(index, value) => updateSchoolExperience(index, 'schoolLink', value)"
          @update-major="(index, value) => updateSchoolExperience(index, 'major', value)"
          @update-start-date="(index, value) => updateSchoolExperience(index, 'startDate', value)"
          @update-end-date="(index, value) => updateSchoolExperience(index, 'endDate', value)"
          @update-description="(index, value) => updateSchoolExperience(index, 'description', value)"
          @set-logo-input-ref="setSchoolLogoInputRef"
          @trigger-logo-input="triggerSchoolLogoInput"
          @upload-logo="handleSchoolLogoUpload"
          @remove-logo="removeSchoolLogo"
          @save="saveSchoolExperience"
        />

        <!-- 相册列表 -->
        <GalleryList
          :gallery="profileData.gallery"
        />

        <!-- 编辑相册 -->
        <GalleryEdit
          v-if="editMode && canEdit"
          :gallery="editData.gallery"
          :saving="savingGallery"
          @add="addPhoto"
          @remove="removePhoto"
          @update-caption="updatePhotoCaption"
          @save="saveGallery"
        />
      </div>
    </main>

    <!-- 悬浮编辑控制栏 -->
    <transition name="fade">
      <div v-if="editMode && canEdit" style="position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); z-index: 50; display: flex; gap: 0.5rem; background: var(--color-bg-overlay); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); padding: 0.5rem; border-radius: 9999px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2); border: 1px solid var(--color-border-tertiary); min-width: 200px; justify-content: center;">
        <button
          @click="cancelEdit"
          style="padding: 0.75rem 1.5rem; border-radius: 9999px; font-weight: 600; color: var(--color-text-secondary); transition: all 0.2s; cursor: pointer; border: none; background: transparent;"
          onmouseover="this.style.backgroundColor='var(--color-bg-tertiary)'; this.style.color='var(--color-text-primary)'"
          onmouseout="this.style.backgroundColor='transparent'; this.style.color='var(--color-text-secondary)'"
        >
          {{ $t('common.cancel') }}
        </button>
        <button
          @click="saveAll"
          :disabled="isAnySaving"
          style="padding: 0.75rem 2rem; border-radius: 9999px; font-weight: 600; color: var(--color-text-inverse); background: var(--color-primary); transition: all 0.2s; cursor: pointer; border: none; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center;"
          onmouseover="this.style.transform='translateY(-1px)'; this.style.backgroundColor='var(--color-primary-hover)'"
          onmouseout="this.style.transform='translateY(0)'; this.style.backgroundColor='var(--color-primary)'"
        >
          <template v-if="isAnySaving">
            <svg class="animate-spin" style="width: 1.25rem; height: 1.25rem; margin-right: 0.5rem;" fill="none" viewBox="0 0 24 24">
              <circle style="opacity: 0.25;" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path style="opacity: 0.75;" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ $t('common.saving') }}
          </template>
          <template v-else>
            {{ $t('common.save') }}
          </template>
        </button>
      </div>
    </transition>

    <!-- 二维码弹窗 -->
    <QRCodeModal
      :show="qrCodeModal.show"
      :image="qrCodeModal.image"
      :label="qrCodeModal.label"
      @close="closeQrCodeModal"
    />

    <!-- 通知弹窗 -->
    <NotificationModal
      :show="notificationModal.show"
      :type="notificationModal.type"
      :title="notificationModal.title"
      :message="notificationModal.message"
      :details="notificationModal.details"
      @close="closeNotificationModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead } from '@vueuse/head'
import Navigation from '../components/Navigation.vue'
import ProfileHeader from '../components/ProfileHeader.vue'
import ProfileEditForm from '../components/ProfileEditForm.vue'
import ContactList from '../components/ContactList.vue'
import ContactEdit from '../components/ContactEdit.vue'
import SocialLinksList from '../components/SocialLinksList.vue'
import SocialLinksEdit from '../components/SocialLinksEdit.vue'
import ProjectsList from '../components/ProjectsList.vue'
import ProjectsEdit from '../components/ProjectsEdit.vue'
import GalleryList from '../components/GalleryList.vue'
import GalleryEdit from '../components/GalleryEdit.vue'
import QRCodeModal from '../components/QRCodeModal.vue'
import NotificationModal from '../components/NotificationModal.vue'
import UserNotFound from '../components/UserNotFound.vue'
import WorkExperience from '../components/WorkExperience.vue'
import WorkExperienceEdit from '../components/WorkExperienceEdit.vue'
import SchoolExperience from '../components/SchoolExperience.vue'
import SchoolExperienceEdit from '../components/SchoolExperienceEdit.vue'
import { useSocialLinksData } from '../composables/useGitHubData'
import { supportedLocales } from '../i18n'
import { userAPI, authAPI } from '../api/index.js'

const route = useRoute()
const { t, locale } = useI18n()
const username = route.params.username

// 系统设置
const settings = ref({ title: 'OpenBioCard', logo: '' })

// 用户状态
const currentUser = ref(null)
const token = ref('')
const userNotFound = ref(false)

// 获取系统设置
const fetchSettings = async () => {
  try {
    const data = await userAPI.getSettings()
    settings.value = data
  } catch (error) {
    console.error('获取系统设置失败:', error)
  }
}

// 资料数据
const profileData = ref({
  username: username,
  name: '',
  userType: '',
  pronouns: '',
  avatar: '',
  bio: '',
  location: '',
  website: '',
  background: '',
  currentCompany: '',
  currentCompanyLink: '',
  currentSchool: '',
  currentSchoolLink: '',
  workExperiences: [],
  schoolExperiences: [],
  contacts: [],
  socialLinks: [],
  projects: [],
  gallery: []
})

// 编辑状态
const editMode = ref(false)
const saving = ref(false) // Keep for backward compatibility if needed, or remove?
// Separate saving states for each section
const savingProfileHeader = ref(false)
const savingContacts = ref(false)
const savingSocialLinks = ref(false)
const savingProjects = ref(false)
const savingWork = ref(false)
const savingSchool = ref(false)
const savingGallery = ref(false)

const editData = ref({ ...profileData.value })

// 编辑语言状态
const currentEditLang = ref('default')

// 计算当前编辑的数据（合并默认数据和语言特定数据）
const activeEditData = computed(() => {
  if (currentEditLang.value === 'default') {
    return editData.value
  }
  
  // 确保 locales 对象存在
  if (!editData.value.locales) {
    editData.value.locales = {}
  }
  // 确保特定语言对象存在
  if (!editData.value.locales[currentEditLang.value]) {
    editData.value.locales[currentEditLang.value] = {}
  }
  
  // 合并数据
  return {
    ...editData.value,
    ...editData.value.locales[currentEditLang.value]
  }
})

// 更新编辑字段的辅助函数
const updateEditField = (field, value) => {
  if (currentEditLang.value === 'default') {
    editData.value[field] = value
  } else {
    if (!editData.value.locales) editData.value.locales = {}
    if (!editData.value.locales[currentEditLang.value]) editData.value.locales[currentEditLang.value] = {}
    editData.value.locales[currentEditLang.value][field] = value
  }
}

// 显示用的资料数据（根据当前界面语言自动切换）
const displayProfileData = computed(() => {
  const currentLocale = locale.value
  const data = { ...profileData.value }
  
  if (data.locales && data.locales[currentLocale]) {
    // 过滤掉空值，避免覆盖默认值（可选，根据需求决定）
    // 这里简单合并
    Object.assign(data, data.locales[currentLocale])
  }
  return data
})

// 是否正在保存任何部分
const isAnySaving = computed(() => {
  return savingProfileHeader.value ||
         savingContacts.value ||
         savingSocialLinks.value ||
         savingProjects.value ||
         savingWork.value ||
         savingSchool.value ||
         savingGallery.value
})

// 保存所有更改
const saveAll = async () => {
  // performSave 会更新所有更改的字段
  await saveProfileHeader()
}

// 二维码弹窗状态
const qrCodeModal = ref({
  show: false,
  image: '',
  label: ''
})

// 通知弹窗状态
const notificationModal = ref({
  show: false,
  type: 'info',
  title: '',
  message: ''
})

// 获取cookie
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// 删除cookie
const deleteCookie = (name) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// 检查是否可以编辑
const canEdit = computed(() => {
  return currentUser.value && currentUser.value.username === username
})

// 检查是否为base64图片
const isBase64Image = (str) => {
  return str && str.startsWith('data:image/') && str.includes('base64,')
}

// 获取联系方式标签
const getContactLabel = (type) => {
  const labels = {
    email: t('contact.types.email'),
    phone: t('contact.types.phone'),
    wechat: t('contact.types.wechat'),
    qq: t('contact.types.qq'),
    whatsapp: t('contact.types.whatsapp'),
    telegram: t('contact.types.telegram'),
    discord: t('contact.types.discord'),
    line: t('contact.types.line'),
    wecom: t('contact.types.wechat_work')
  }
  return labels[type] || type
}

// 社交媒体链接数据管理
const { fetchAllData: fetchSocialLinksData, initialize: initializeSocialLinks } = useSocialLinksData(profileData)

// 加载用户资料
const loadProfile = async () => {
  try {
    const data = await userAPI.getProfile(username)
    profileData.value = { ...profileData.value, ...data }
    // 确保 socialLinks、projects、gallery、workExperiences 和 schoolExperiences 是数组
    if (!profileData.value.socialLinks) {
      profileData.value.socialLinks = []
    }
    if (!profileData.value.projects) {
      profileData.value.projects = []
    }
    if (!profileData.value.gallery) {
      profileData.value.gallery = []
    }
    if (!profileData.value.workExperiences) {
      profileData.value.workExperiences = []
    }
    if (!profileData.value.schoolExperiences) {
      profileData.value.schoolExperiences = []
    }
    // 使用深拷贝避免引用问题
    editData.value = JSON.parse(JSON.stringify(profileData.value))
    // 初始化社交媒体链接数据（获取 GitHub 信息并启动定时更新）
    await initializeSocialLinks()

    useHead({
      title: computed(() => `${profileData.value.username} - ${settings.value.title || 'OpenBioCard'}`),
      meta: [
        { name: 'description', content: computed(() => profileData.value.bio || `${profileData.value.username} 的个人资料页面`) },
        // Open Graph
        { property: 'og:title', content: computed(() => `${profileData.value.username} - ${settings.value.title || 'OpenBioCard'}`) },
        { property: 'og:description', content: computed(() => profileData.value.bio || `${profileData.value.username} 的个人资料页面`) },
        { property: 'og:image', content: computed(() => profileData.value.avatar || '/icon/logo.svg') },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'profile' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: computed(() => `${profileData.value.username} - ${settings.value.title || 'OpenBioCard'}`) },
        { name: 'twitter:description', content: computed(() => profileData.value.bio || `${profileData.value.username} 的个人资料页面`) },
        { name: 'twitter:image', content: computed(() => profileData.value.avatar || '/icon/logo.svg') }
      ]
    })

    // 监听 logo 变化并更新 favicon
    watch(() => settings.value.logo, (newLogo) => {
      if (typeof document !== 'undefined') {
        const svgIcon = document.getElementById('favicon-svg')
        const icoIcon = document.getElementById('favicon-ico')
        if (newLogo) {
          if (svgIcon) svgIcon.href = newLogo
          if (icoIcon) icoIcon.href = newLogo
        }
      }
    }, { immediate: true })

    userNotFound.value = false
  } catch (error) {
    if (error.message === 'User not found') {
      // 用户不存在，显示404页面
      userNotFound.value = true
    } else {
      console.error('加载用户资料失败:', error)
      userNotFound.value = true
    }
  }
}

// 检查登录状态
const checkLogin = () => {
  const savedToken = getCookie('auth_token')
  const savedUsername = getCookie('auth_username')

  if (savedToken && savedUsername) {
    token.value = savedToken
    currentUser.value = { username: savedUsername, token: savedToken }
  }
}

// 检查数据是否有更改
const getChangedFields = (oldData, newData) => {
  const changes = {}
  Object.keys(newData).forEach(key => {
    // 特殊处理数组和对象，使用 JSON.stringify 进行简单深比较
    const oldValue = oldData[key]
    const newValue = newData[key]
    
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes[key] = newValue
    }
  })
  return changes
}

// 通用保存函数
const performSave = async (loadingRef) => {
  if (!currentUser.value || !token.value) return

  loadingRef.value = true
  try {
    // 过滤掉空的学校经历（没有学校名称的）
    const filteredData = { ...editData.value }
    if (filteredData.schoolExperiences) {
      filteredData.schoolExperiences = filteredData.schoolExperiences.filter(exp => exp.school && exp.school.trim())
    }
    // 同样过滤工作经历
    if (filteredData.workExperiences) {
      filteredData.workExperiences = filteredData.workExperiences.filter(exp => exp.position && exp.position.trim() && exp.company && exp.company.trim())
    }

    // 获取已更改的字段
    const changedFields = getChangedFields(profileData.value, filteredData)
    
    // 如果没有更改，直接返回
    if (Object.keys(changedFields).length === 0) {
      showNotification('info', t('common.tips'), t('profile.noChanges'))
      loadingRef.value = false
      return
    }

    await userAPI.updateProfile(username, changedFields, token.value)
    // 使用深拷贝更新本地数据
    profileData.value = JSON.parse(JSON.stringify(filteredData))
    // 不关闭编辑模式，允许用户继续编辑其他部分
    // editMode.value = false 
    showNotification('success', t('common.tips'), t('profile.saveSuccess'))
  } catch (error) {
    showNotification('error', t('common.tips'), t('profile.saveFailed'), error.message || String(error))
  } finally {
    loadingRef.value = false
  }
}

// 各个部分的保存函数
const saveProfileHeader = () => performSave(savingProfileHeader)
const saveContacts = () => performSave(savingContacts)
const saveSocialLinks = () => performSave(savingSocialLinks)
const saveProjects = () => performSave(savingProjects)
const saveWorkExperience = () => performSave(savingWork)
const saveSchoolExperience = () => performSave(savingSchool)
const saveGallery = () => performSave(savingGallery)

// 兼容旧的 saveProfile 函数（如果还有其他地方用到）
const saveProfile = saveProfileHeader

// 取消编辑
const cancelEdit = () => {
  // 使用深拷贝避免引用问题
  editData.value = JSON.parse(JSON.stringify(profileData.value))
  editMode.value = false
}

// 导出账户数据
const handleExportData = async () => {
  try {
    const data = await userAPI.exportData(username, token.value)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `openbiocard-${username}-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    showNotification('success', t('data.exportSuccess'), '')
  } catch (error) {
    console.error('导出数据失败:', error)
    showNotification('error', t('data.exportFailed'), error.message)
  }
}

// 导入账户数据
const handleImportData = async (data) => {
  try {
    console.log('开始导入数据:', data)
    await userAPI.importData(username, data, token.value)
    showNotification('success', t('data.importSuccess'), '')
    // 导入成功后刷新页面
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch (error) {
    console.error('导入数据失败:', error)
    showNotification('error', t('data.importFailed'), error.message)
  }
}

// 添加联系方式
const addContact = () => {
  editData.value.contacts.push({ type: 'email', value: '' })
}

// 删除联系方式
const removeContact = (index) => {
  editData.value.contacts.splice(index, 1)
}

// 更新联系方式类型
const updateContactType = (index, type) => {
  editData.value.contacts[index].type = type
}

// 更新联系方式值
const updateContactValue = (index, value) => {
  editData.value.contacts[index].value = value
}

// 处理联系方式上传（二维码）
const handleContactUpload = (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    showNotification('error', t('common.tips'), t('contact.qrCodeTooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    showNotification('error', t('common.tips'), t('contact.selectImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.contacts[index].value = e.target.result
  }
  reader.readAsDataURL(file)
}

// 处理联系方式点击
const handleContactClick = (contact) => {
  if (isBase64Image(contact.value)) {
    qrCodeModal.value = {
      show: true,
      image: contact.value,
      label: getContactLabel(contact.type)
    }
  }
}

// 关闭二维码弹窗
const closeQrCodeModal = () => {
  qrCodeModal.value = {
    show: false,
    image: '',
    label: ''
  }
}

// 关闭通知弹窗
const closeNotificationModal = () => {
  notificationModal.value = {
    show: false,
    type: 'info',
    title: '',
    message: '',
    details: ''
  }
}

// 显示通知弹窗
const showNotification = (type, title, message, details = '') => {
  notificationModal.value = {
    show: true,
    type,
    title,
    message,
    details
  }
}

// 添加社交媒体链接
const addSocialLink = () => {
  if (!editData.value.socialLinks) {
    editData.value.socialLinks = []
  }
  editData.value.socialLinks.push({ type: 'github', value: '' })
}

// 删除社交媒体链接
const removeSocialLink = (index) => {
  editData.value.socialLinks.splice(index, 1)
}

// 更新社交媒体链接类型
const updateSocialLinkType = (index, type) => {
  editData.value.socialLinks[index].type = type
  // 清除旧的 GitHub 数据
  if (type !== 'github') {
    delete editData.value.socialLinks[index].githubData
  }
}

// 防抖函数
const debounce = (func, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(null, args), delay)
  }
}

// 更新社交媒体链接值
const updateSocialLinkValue = async (index, value) => {
  editData.value.socialLinks[index].value = value

  // 如果是 GitHub 链接，使用防抖获取数据
  if (editData.value.socialLinks[index].type === 'github' && value) {
    debouncedFetchGitHubData(index, value)
  }
}

// 防抖的GitHub数据获取函数（延迟1秒）
const debouncedFetchGitHubData = debounce(async (index, value) => {
  try {
    // 清理用户名，移除开头的 @ 符号
    const cleanUsername = value.replace(/^@/, '')
    const response = await fetch(`https://api.github.com/users/${cleanUsername}`)
    if (response.ok) {
      const result = await response.json()
      editData.value.socialLinks[index].githubData = {
        login: result.login,
        name: result.name,
        avatar_url: result.avatar_url,
        bio: result.bio,
        location: result.location,
        blog: result.blog,
        twitter_username: result.twitter_username,
        public_repos: result.public_repos,
        followers: result.followers,
        following: result.following,
        created_at: result.created_at,
        updated_at: result.updated_at
      }
    }
  } catch (err) {
    console.error('获取 GitHub 信息失败:', err)
  }
}, 1000)

// 添加项目
const addProject = () => {
  if (!editData.value.projects) {
    editData.value.projects = []
  }
  editData.value.projects.push({
    name: '',
    url: '',
    description: '',
    logo: ''
  })
}

// 删除项目
const removeProject = (index) => {
  editData.value.projects.splice(index, 1)
}

// 更新项目名称
const updateProjectName = (index, name) => {
  editData.value.projects[index].name = name
}

// 更新项目地址
const updateProjectUrl = (index, url) => {
  editData.value.projects[index].url = url
}

// 更新项目描述
const updateProjectDescription = (index, description) => {
  editData.value.projects[index].description = description
}

// 处理项目 Logo 上传
const handleProjectLogoUpload = (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    showNotification('error', t('common.tips'), t('profile.imageTooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    showNotification('error', t('common.tips'), t('contact.selectImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.projects[index].logo = e.target.result
  }
  reader.readAsDataURL(file)
}

// 添加相册照片
const addPhoto = (photoData) => {
  if (!editData.value.gallery) {
    editData.value.gallery = []
  }
  editData.value.gallery.push(photoData)
}

// 删除相册照片
const removePhoto = (index) => {
  editData.value.gallery.splice(index, 1)
}

// 更新照片说明
const updatePhotoCaption = (index, caption) => {
  editData.value.gallery[index].caption = caption
}


// 添加工作经历
const addWorkExperience = () => {
  if (!editData.value.workExperiences) {
    editData.value.workExperiences = []
  }
  editData.value.workExperiences.push({
    position: '',
    company: '',
    companyLink: '',
    startDate: '',
    endDate: '',
    description: '',
    logo: ''
  })
}

// 删除工作经历
const removeWorkExperience = (index) => {
  editData.value.workExperiences.splice(index, 1)
}

// 更新工作经历
const updateWorkExperience = (index, field, value) => {
  editData.value.workExperiences[index][field] = value
}

// 处理工作经历 Logo 上传
const handleWorkLogoUpload = (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    showNotification('error', t('common.tips'), t('profile.imageTooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    showNotification('error', t('common.tips'), t('contact.selectImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.workExperiences[index].logo = e.target.result
  }
  reader.readAsDataURL(file)
}

// 工作经历 Logo 输入元素引用
const workLogoInputs = ref([])

// 设置工作经历 Logo 输入元素引用
const setWorkLogoInputRef = (el, index) => {
  if (el) {
    workLogoInputs.value[index] = el
  }
}

// 触发工作经历 Logo 文件选择
const triggerWorkLogoInput = (index) => {
  if (workLogoInputs.value[index]) {
    workLogoInputs.value[index].click()
  }
}

// 移除工作经历 Logo
const removeWorkLogo = (index) => {
  editData.value.workExperiences[index].logo = ''
}

// 添加学校经历
const addSchoolExperience = () => {
  if (!editData.value.schoolExperiences) {
    editData.value.schoolExperiences = []
  }
  editData.value.schoolExperiences.push({
    degree: '',
    school: '',
    schoolLink: '',
    major: '',
    startDate: '',
    endDate: '',
    description: '',
    logo: ''
  })
}

// 删除学校经历
const removeSchoolExperience = (index) => {
  editData.value.schoolExperiences.splice(index, 1)
}

// 更新学校经历
const updateSchoolExperience = (index, field, value) => {
  editData.value.schoolExperiences[index][field] = value
}

// 处理学校经历 Logo 上传
const handleSchoolLogoUpload = (event, index) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.size > 2 * 1024 * 1024) {
    showNotification('error', t('common.tips'), t('profile.imageTooLarge'))
    return
  }

  if (!file.type.startsWith('image/')) {
    showNotification('error', t('common.tips'), t('contact.selectImageFile'))
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    editData.value.schoolExperiences[index].logo = e.target.result
  }
  reader.readAsDataURL(file)
}

// 学校经历 Logo 输入元素引用
const schoolLogoInputs = ref([])

// 设置学校经历 Logo 输入元素引用
const setSchoolLogoInputRef = (el, index) => {
  if (el) {
    schoolLogoInputs.value[index] = el
  }
}

// 触发学校经历 Logo 文件选择
const triggerSchoolLogoInput = (index) => {
  if (schoolLogoInputs.value[index]) {
    schoolLogoInputs.value[index].click()
  }
}

// 移除学校经历 Logo
const removeSchoolLogo = (index) => {
  editData.value.schoolExperiences[index].logo = ''
}

// 退出登录
const logout = () => {
  deleteCookie('auth_token')
  deleteCookie('auth_username')
  currentUser.value = null
  token.value = ''
  window.location.href = '/'
}

onMounted(async () => {
  await fetchSettings()
  checkLogin()
  loadProfile()
})
</script>
