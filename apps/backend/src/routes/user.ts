import { Router, Response } from 'express';
import { FileManager, UserProfile } from '../utils/fileManager';
import { ImageValidator } from '../utils/imageValidator';
import { authMiddleware, requireRole, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// 所有路由都需要認證
router.use(authMiddleware);

/**
 * 獲取當前用戶的個人資料
 */
router.get('/profile', (req: AuthenticatedRequest, res: Response) => {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    let profile = FileManager.readUserProfile(username);

    // 如果個人資料不存在，創建一個初始資料
    if (!profile) {
      profile = FileManager.createInitialUserProfile(username);
    }

    res.json({
      success: true,
      profile: {
        username: profile.username,
        displayName: profile.displayName,
        bio: profile.bio,
        avatar: profile.avatar,
        isInitialized: profile.isInitialized,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
});

/**
 * 更新用戶個人資料
 */
router.put('/profile', (req: AuthenticatedRequest, res: Response) => {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const { displayName, bio, avatar } = req.body;

    // 驗證必填字段
    if (!displayName || displayName.trim() === '') {
      return res.status(400).json({ error: 'Display name is required' });
    }

    // 驗證字段長度
    if (displayName.length > 100) {
      return res.status(400).json({ error: 'Display name must be less than 100 characters' });
    }

    if (bio && bio.length > 500) {
      return res.status(400).json({ error: 'Bio must be less than 500 characters' });
    }

    // 如果提供了頭像，驗證圖片
    let validatedAvatar = '';
    if (avatar && avatar.trim() !== '') {
      const validationResult = ImageValidator.validateBase64Image(avatar);

      if (!validationResult.valid) {
        return res.status(400).json({
          error: `Invalid avatar image: ${validationResult.error}`
        });
      }

      validatedAvatar = ImageValidator.sanitizeBase64(avatar);

      console.log(`Avatar validated for ${username}: size=${validationResult.size} bytes, type=${validationResult.mimeType}`);
    }

    // 獲取現有個人資料或創建新的
    let profile = FileManager.readUserProfile(username);
    if (!profile) {
      profile = FileManager.createInitialUserProfile(username);
    }

    // 更新個人資料數據
    const updatedProfile: UserProfile = {
      username,
      displayName: displayName.trim(),
      bio: bio ? bio.trim() : '',
      avatar: validatedAvatar,
      isInitialized: true, // 標記為已初始化
      createdAt: profile.createdAt,
      updatedAt: new Date().toISOString()
    };

    FileManager.saveUserProfile(username, updatedProfile);

    console.log(`Profile updated for user: ${username}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: {
        username: updatedProfile.username,
        displayName: updatedProfile.displayName,
        bio: updatedProfile.bio,
        avatar: updatedProfile.avatar,
        isInitialized: updatedProfile.isInitialized,
        createdAt: updatedProfile.createdAt,
        updatedAt: updatedProfile.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * 檢查個人資料是否已初始化
 */
router.get('/profile/status', (req: AuthenticatedRequest, res: Response) => {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const isInitialized = FileManager.isUserProfileInitialized(username);

    res.json({
      success: true,
      isInitialized,
      username
    });
  } catch (error) {
    console.error('Check profile status error:', error);
    res.status(500).json({ error: 'Failed to check profile status' });
  }
});

/**
 * 刪除頭像
 */
router.delete('/profile/avatar', (req: AuthenticatedRequest, res: Response) => {
  try {
    const username = req.user?.username;
    if (!username) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const profile = FileManager.readUserProfile(username);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.avatar = '';
    profile.updatedAt = new Date().toISOString();
    FileManager.saveUserProfile(username, profile);

    console.log(`Avatar deleted for user: ${username}`);

    res.json({
      success: true,
      message: 'Avatar deleted successfully'
    });
  } catch (error) {
    console.error('Delete avatar error:', error);
    res.status(500).json({ error: 'Failed to delete avatar' });
  }
});

export default router;
