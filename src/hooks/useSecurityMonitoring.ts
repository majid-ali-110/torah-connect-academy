import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  type: 'login_attempt' | 'data_access' | 'suspicious_activity';
  details: any;
  timestamp: Date;
}

export const useSecurityMonitoring = () => {
  const securityEvents = useRef<SecurityEvent[]>([]);
  const lastActivityTime = useRef<Date>(new Date());

  const logSecurityEvent = async (type: SecurityEvent['type'], details: any) => {
    const event: SecurityEvent = {
      type,
      details,
      timestamp: new Date()
    };
    
    securityEvents.current.push(event);
    
    // Keep only last 100 events in memory
    if (securityEvents.current.length > 100) {
      securityEvents.current = securityEvents.current.slice(-100);
    }
    
    console.log('Security Event:', event);
    
    // Log to Supabase for admin monitoring (if user is authenticated)
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // You could create a security_logs table and insert here
        // For now, we'll just log to console
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  const detectSuspiciousActivity = () => {
    const now = new Date();
    const recentEvents = securityEvents.current.filter(
      event => now.getTime() - event.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    );
    
    // Detect rapid succession of failed login attempts
    const failedLogins = recentEvents.filter(
      event => event.type === 'login_attempt' && !event.details.success
    );
    
    if (failedLogins.length >= 3) {
      logSecurityEvent('suspicious_activity', {
        reason: 'Multiple failed login attempts',
        count: failedLogins.length
      });
    }
  };

  const updateActivity = () => {
    lastActivityTime.current = new Date();
  };

  useEffect(() => {
    const handleUserActivity = () => {
      updateActivity();
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleUserActivity, true);
    });

    // Check for session timeout every minute
    const timeoutCheck = setInterval(() => {
      const now = new Date();
      const timeSinceActivity = now.getTime() - lastActivityTime.current.getTime();
      
      // Auto logout after 30 minutes of inactivity
      if (timeSinceActivity > 30 * 60 * 1000) {
        logSecurityEvent('suspicious_activity', {
          reason: 'Session timeout due to inactivity'
        });
        supabase.auth.signOut();
      }
    }, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserActivity, true);
      });
      clearInterval(timeoutCheck);
    };
  }, []);

  return {
    logSecurityEvent,
    detectSuspiciousActivity,
    updateActivity
  };
};
