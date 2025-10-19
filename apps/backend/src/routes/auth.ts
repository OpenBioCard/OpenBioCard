import { Router, Request, Response } from 'express';
import { FileManager } from '../utils/fileManager';
import { SecurityUtils } from '../utils/security';

const router = Router();

router.post('/login', (req: Request, res: Response) => {
  try {
    console.log('🔍 Login request received:');
    console.log('Request body:', req.body);
    console.log('Content-Type:', req.get('Content-Type'));
    console.log('Headers:', req.headers);
    
    const { username, password } = req.body;

    console.log('🔍 Extracted credentials:');
    console.log('Username:', username);
    console.log('Password present:', !!password);

    if (!username || !password) {
      console.log('❌ Missing credentials - username:', !!username, 'password:', !!password);
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = FileManager.findUserByUsername(username);
    console.log('🔍 User lookup result:', user ? { id: user.id, username: user.username, role: user.role } : 'User not found');
    
    if (!user) {
      console.log('❌ User not found for username:', username);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log('🔍 Verifying password...');
    console.log('Stored password hash:', user.password);
    console.log('Input password:', password);
    
    const isPasswordValid = SecurityUtils.verifyPassword(password, user.password);
    console.log('🔍 Password verification result:', isPasswordValid);
    
    if (!isPasswordValid) {
      console.log('❌ Password verification failed');
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = SecurityUtils.generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;