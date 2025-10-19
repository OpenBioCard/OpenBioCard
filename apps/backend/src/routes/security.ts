import { Router } from 'express';
import { requireRole } from '../middleware/auth';
import { SecurityMonitor } from '../utils/securityMonitor';
import { SecurityAuditor } from '../utils/securityAuditor';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/security/metrics', requireRole('root'), (req, res) => {
  try {
    const report = SecurityMonitor.getSecurityReport();
    res.json({
      success: true,
      data: report,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting security metrics:', error);
    res.status(500).json({ error: 'Failed to get security metrics' });
  }
});

router.get('/security/alerts', requireRole('root'), (req, res) => {
  try {
    const alerts = SecurityMonitor.checkAlerts();
    res.json({
      success: true,
      alerts,
      severity: alerts.length > 0 ? 'high' : 'low',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking security alerts:', error);
    res.status(500).json({ error: 'Failed to check security alerts' });
  }
});

router.get('/security/events', requireRole('root'), (req, res) => {
  try {
    const hours = parseInt(req.query.hours as string) || 24;
    const events = SecurityAuditor.getRecentSecurityEvents(hours);
    
    res.json({
      success: true,
      events,
      count: events.length,
      timeRange: `${hours} hours`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting security events:', error);
    res.status(500).json({ error: 'Failed to get security events' });
  }
});

router.post('/security/reset-metrics', requireRole('root'), (req: AuthenticatedRequest, res) => {
  try {
    SecurityMonitor.resetMetrics();
    
    SecurityAuditor.logSecurityEvent(
      'METRICS_RESET',
      'medium',
      { resetBy: req.user?.username },
      req
    );
    
    res.json({
      success: true,
      message: 'Security metrics reset successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error resetting security metrics:', error);
    res.status(500).json({ error: 'Failed to reset security metrics' });
  }
});

router.get('/security/integrity', requireRole('root'), (req, res) => {
  try {
    const integrity = SecurityAuditor.verifyLogIntegrity();
    
    if (!integrity.valid) {
      SecurityAuditor.logSecurityEvent(
        'LOG_TAMPERING_DETECTED',
        'critical',
        { tamperedEntries: integrity.tamperedEntries },
        req
      );
    }
    
    res.json({
      success: true,
      integrity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error checking log integrity:', error);
    res.status(500).json({ error: 'Failed to check log integrity' });
  }
});

export default router;