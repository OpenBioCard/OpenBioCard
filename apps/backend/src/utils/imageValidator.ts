import crypto from 'crypto';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

// Known malicious patterns in images (basic detection)
const MALICIOUS_PATTERNS = [
  /<script/i,
  /javascript:/i,
  /onerror=/i,
  /onload=/i,
  /eval\(/i,
  /<iframe/i,
  /<object/i,
  /<embed/i,
];

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  size?: number;
  mimeType?: string;
}

export class ImageValidator {
  /**
   * 驗證base64圖片數據
   */
  static validateBase64Image(base64Data: string): ImageValidationResult {
    try {
      // 檢查是否為空
      if (!base64Data || base64Data.trim() === '') {
        return { valid: false, error: 'Image data is empty' };
      }

      // 提取MIME類型和實際的base64數據
      let mimeType = '';
      let actualBase64 = base64Data;

      if (base64Data.startsWith('data:')) {
        const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) {
          return { valid: false, error: 'Invalid base64 format' };
        }
        mimeType = matches[1];
        actualBase64 = matches[2];
      }

      // 驗證MIME類型
      if (mimeType && !ALLOWED_IMAGE_TYPES.includes(mimeType.toLowerCase())) {
        return {
          valid: false,
          error: `Invalid image type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`
        };
      }

      // 解碼base64並計算大小
      let buffer: Buffer;
      try {
        buffer = Buffer.from(actualBase64, 'base64');
      } catch (decodeError) {
        return { valid: false, error: 'Invalid base64 encoding' };
      }

      const size = buffer.length;

      // 檢查文件大小
      if (size > MAX_IMAGE_SIZE) {
        return {
          valid: false,
          error: `Image size exceeds maximum allowed size of ${MAX_IMAGE_SIZE / 1024 / 1024}MB`
        };
      }

      if (size === 0) {
        return { valid: false, error: 'Image data is empty after decoding' };
      }

      // 驗證圖片文件頭（magic numbers）
      const magicNumberValid = this.validateImageMagicNumber(buffer, mimeType);
      if (!magicNumberValid) {
        return { valid: false, error: 'Image file header validation failed - file may be corrupted or not a real image' };
      }

      // 檢查惡意代碼模式
      const maliciousCheck = this.checkForMaliciousPatterns(buffer);
      if (!maliciousCheck.valid) {
        return maliciousCheck;
      }

      return {
        valid: true,
        size,
        mimeType: mimeType || this.detectMimeTypeFromBuffer(buffer)
      };
    } catch (error) {
      console.error('Image validation error:', error);
      return {
        valid: false,
        error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * 驗證圖片文件頭（magic numbers）
   */
  private static validateImageMagicNumber(buffer: Buffer, declaredMimeType: string): boolean {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return !declaredMimeType || declaredMimeType.includes('jpeg') || declaredMimeType.includes('jpg');
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return !declaredMimeType || declaredMimeType.includes('png');
    }

    // GIF: 47 49 46 38 (GIF8)
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
      return !declaredMimeType || declaredMimeType.includes('gif');
    }

    // WebP: 52 49 46 46 ... 57 45 42 50 (RIFF...WEBP)
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) {
      // Check for WEBP marker at offset 8
      if (buffer.length > 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
        return !declaredMimeType || declaredMimeType.includes('webp');
      }
    }

    return false;
  }

  /**
   * 從buffer檢測MIME類型
   */
  private static detectMimeTypeFromBuffer(buffer: Buffer): string {
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return 'image/jpeg';
    }
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) {
      return 'image/png';
    }
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) {
      return 'image/gif';
    }
    if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
        buffer.length > 12 && buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
      return 'image/webp';
    }
    return 'application/octet-stream';
  }

  /**
   * 檢查惡意代碼模式
   */
  private static checkForMaliciousPatterns(buffer: Buffer): ImageValidationResult {
    const content = buffer.toString('utf8', 0, Math.min(buffer.length, 10000)); // 只檢查前10KB

    for (const pattern of MALICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        console.warn('Malicious pattern detected in image:', pattern);
        return {
          valid: false,
          error: 'Potentially malicious content detected in image'
        };
      }
    }

    return { valid: true };
  }

  /**
   * 清理base64數據，確保格式正確
   */
  static sanitizeBase64(base64Data: string): string {
    // 如果已經有data URI前綴，保持原樣
    if (base64Data.startsWith('data:')) {
      return base64Data;
    }

    // 否則添加默認的JPEG前綴
    return `data:image/jpeg;base64,${base64Data}`;
  }

  /**
   * 計算圖片的哈希值（用於檢測重複或驗證完整性）
   */
  static calculateImageHash(base64Data: string): string {
    const actualBase64 = base64Data.includes('base64,')
      ? base64Data.split('base64,')[1]
      : base64Data;

    const buffer = Buffer.from(actualBase64, 'base64');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
