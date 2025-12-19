/**
 * 压缩图片并返回 Base64 字符串
 * @param {File} file - 图片文件
 * @param {Object} options - 压缩选项
 * @param {number} options.maxWidth - 最大宽度 (默认 1024)
 * @param {number} options.maxHeight - 最大高度 (默认 1024)
 * @param {number} options.quality - 压缩质量 (0.1 - 1.0, 默认 0.8)
 * @returns {Promise<string>} - 返回压缩后的 Base64 字符串
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1024,
    maxHeight = 1024,
    quality = 0.8
  } = options

  return new Promise((resolve, reject) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'))
      return
    }

    // 如果是 SVG，直接返回 Base64，不进行压缩
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = (e) => reject(e)
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (e) => {
      const img = new Image()
      img.src = e.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // 计算缩放比例
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // 导出为压缩后的 Base64
        // 只有 jpeg 和 webp 支持质量参数
        const exportType = file.type === 'image/png' ? 'image/png' : 'image/jpeg'
        const compressedBase64 = canvas.toDataURL(exportType, quality)
        resolve(compressedBase64)
      }
      img.onerror = (err) => reject(err)
    }
    reader.onerror = (err) => reject(err)
  })
}
