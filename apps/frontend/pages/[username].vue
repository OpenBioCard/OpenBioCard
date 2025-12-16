<template>
  <div style="min-height: 100vh; background: var(--gradient-bg);">
    <!-- 导航栏 -->
    <Navigation :current-user="currentUser" @logout="logout" />

    <!-- 404 页面 -->
    <UserNotFound v-if="userNotFound" :username="username" />

    <!-- 主要内容 -->
    <main v-else style="max-width: 1152px; margin: 0 auto; padding: 2rem 1rem;">
      <div style="background: var(--color-bg-overlay); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 1rem; box-shadow: var(--shadow-sm); border: 1px solid var(--color-border-tertiary); overflow: hidden;">
        <!-- 资料头部 -->
        <ProfileHeader
          :profile-data="profileData"
          :can-edit="canEdit"
          @toggle-edit="editMode = !editMode"
        />

        <!-- 编辑模式 -->
        <ProfileEditForm
          v-if="editMode && canEdit"
          :edit-data="editData"
          :username="username"
          :saving="savingProfileHeader"
          @save="saveProfileHeader"
          @cancel="cancelEdit"
          @update:name="editData.name = $event"
          @update:pronouns="editData.pronouns = $event"
          @update:avatar="editData.avatar = $event"
          @update:bio="editData.bio = $event"
          @update:background="editData.background = $event"
          @update:location="editData.location = $event"
          @update:website="editData.website = $event"
          @update:currentCompany="editData.currentCompany = $event"
          @update:currentCompanyLink="editData.currentCompanyLink = $event"
          @update:currentSchool="editData.currentSchool = $event"
          @update:currentSchoolLink="editData.currentSchoolLink = $event"
          @update:workExperiences="editData.workExperiences = $event"
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
      @close="closeNotificationModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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
import { userAPI } from '../api/index.js'

const route = useRoute()
const { t } = useI18n()
const username = route.params.username

// 用户状态
const currentUser = ref(null)
const token = ref('')
const userNotFound = ref(false)

// 资料数据
const profileData = ref({
  username: username,
  name: '',
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

    // 设置页面meta tags
    const title = profileData.value.username
    const description = profileData.value.bio || `${title} 的个人资料页面`
    const image = profileData.value.avatar || '/icon/logo.svg'
    const url = window.location.href

    useHead({
      title: `${title} - OpenBioCard`,
      meta: [
        { name: 'description', content: description },
        // Open Graph
        { property: 'og:title', content: `${title} - OpenBioCard` },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'profile' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: `${title} - OpenBioCard` },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image }
      ]
    })

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

    await userAPI.updateProfile(username, filteredData, token.value)
    // 使用深拷贝避免引用问题
    profileData.value = JSON.parse(JSON.stringify(filteredData))
    // 不关闭编辑模式，允许用户继续编辑其他部分
    // editMode.value = false 
    showNotification('success', t('common.tips'), t('profile.saveSuccess'))
  } catch (error) {
    showNotification('error', t('common.tips'), t('profile.saveFailed'))
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

onMounted(() => {
  checkLogin()
  loadProfile()
})
</script>
