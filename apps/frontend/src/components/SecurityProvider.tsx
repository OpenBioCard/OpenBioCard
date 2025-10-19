import React, { useEffect } from 'react';
import { IntegrityProtector } from '../utils/integrityProtector';

interface SecurityProviderProps {
  children: React.ReactNode;
  enableAntiDebug?: boolean;
  enableInspectionPrevention?: boolean;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({
  children,
  enableAntiDebug = process.env.NODE_ENV === 'production',
  enableInspectionPrevention = process.env.NODE_ENV === 'production'
}) => {
  useEffect(() => {
    // 初始化完整性保護
    IntegrityProtector.initialize();
    
    // 檢測開發者工具使用
    if (enableInspectionPrevention) {
      const interval = setInterval(() => {
        if (IntegrityProtector.detectDevTools()) {
          console.clear();
          console.warn('🚨 Unauthorized inspection detected!');
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [enableAntiDebug, enableInspectionPrevention]);

  return <>{children}</>;
};

// HOC for protecting components
export function withSecurity<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function SecurityWrappedComponent(props: P) {
    useEffect(() => {
      // 檢查頁面完整性
      const checkIntegrity = () => {
        if (typeof window !== 'undefined') {
          const scriptTags = document.querySelectorAll('script[src]');
          const suspiciousScripts = Array.from(scriptTags).filter(script => {
            const src = script.getAttribute('src');
            return src && !src.startsWith(window.location.origin) && 
                   !src.includes('localhost') && 
                   !src.includes('127.0.0.1');
          });
          
          if (suspiciousScripts.length > 0) {
            console.warn('🚨 Suspicious external scripts detected:', suspiciousScripts);
          }
        }
      };
      
      checkIntegrity();
      
      // 定期檢查
      const interval = setInterval(checkIntegrity, 5000);
      return () => clearInterval(interval);
    }, []);

    return <WrappedComponent {...props} />;
  };
}