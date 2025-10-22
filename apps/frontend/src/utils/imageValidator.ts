const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  size?: number;
  mimeType?: string;
}

export class ImageValidator {
  /**
   * 验证图片文件
   */
  static validateImageFile(file: File): ImageValidationResult {
    // 检查文件大小
    if (file.size > MAX_IMAGE_SIZE) {
      return {
        valid: false,
        error: `Image size exceeds maximum allowed size of ${MAX_IMAGE_SIZE / 1024 / 1024}MB. Your image is ${(file.size / 1024 / 1024).toFixed(2)}MB`
      };
    }

    if (file.size === 0) {
      return { valid: false, error: 'Image file is empty' };
    }

    // 检查文件类型
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_IMAGE_TYPES.includes(mimeType)) {
      return {
        valid: false,
        error: `Invalid image type. Allowed types: JPEG, PNG, GIF, WebP. Your file type is ${file.type || 'unknown'}`
      };
    }

    // 检查文件扩展名
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
      return {
        valid: false,
        error: 'Invalid file extension. Please use .jpg, .jpeg, .png, .gif, or .webp files'
      };
    }

    return {
      valid: true,
      size: file.size,
      mimeType: file.type
    };
  }

  /**
   * 将文件转换为base64
   */
  static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * 验证并转换图片文件为base64
   */
  static async validateAndConvertImage(file: File): Promise<{ success: boolean; data?: string; error?: string }> {
    // 首先验证文件
    const validationResult = this.validateImageFile(file);

    if (!validationResult.valid) {
      return {
        success: false,
        error: validationResult.error
      };
    }

    try {
      // 转换为base64
      const base64 = await this.fileToBase64(file);

      return {
        success: true,
        data: base64
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process image'
      };
    }
  }

  /**
   * 获取图片预览URL
   */
  static getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * 清理预览URL
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * 格式化文件大小显示
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  /**
   * 检查是否为有效的base64图片
   */
  static isValidBase64Image(base64: string): boolean {
    if (!base64) return false;

    // 检查是否为data URI格式
    const dataUriPattern = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/i;
    return dataUriPattern.test(base64);
  }
}
