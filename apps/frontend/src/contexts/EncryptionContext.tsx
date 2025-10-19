'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { EncryptionClient } from '../utils/encryptionClient';

interface EncryptionContextType {
  isInitialized: boolean;
  error: string | null;
  request: (url: string, options?: RequestInit) => Promise<Response>;
}

const EncryptionContext = createContext<EncryptionContextType | undefined>(undefined);

export const EncryptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeEncryption = async () => {
      try {
        console.log('🔐 Initializing frontend encryption...');
        await EncryptionClient.initialize();
        setIsInitialized(true);
        setError(null);
        console.log('✓ Frontend encryption initialized');
      } catch (err) {
        console.error('✗ Failed to initialize encryption:', err);
        setError(err instanceof Error ? err.message : 'Encryption initialization failed');
        setIsInitialized(false);
      }
    };

    initializeEncryption();

    // 清理資源
    return () => {
      EncryptionClient.cleanup();
    };
  }, []);

  const request = async (url: string, options?: RequestInit): Promise<Response> => {
    if (!isInitialized) {
      // 嘗試重新初始化一次
      try {
        console.log('🔄 Attempting to reinitialize encryption...');
        await EncryptionClient.initialize();
        setIsInitialized(true);
        setError(null);
        console.log('✓ Encryption reinitialized successfully');
      } catch (err) {
        console.error('✗ Failed to reinitialize encryption:', err);
        throw new Error('Encryption not available: ' + (err instanceof Error ? err.message : 'Unknown error'));
      }
    }
    return EncryptionClient.request(url, options);
  };

  const contextValue: EncryptionContextType = {
    isInitialized,
    error,
    request
  };

  return (
    <EncryptionContext.Provider value={contextValue}>
      {children}
    </EncryptionContext.Provider>
  );
};

export const useEncryption = (): EncryptionContextType => {
  const context = useContext(EncryptionContext);
  if (context === undefined) {
    throw new Error('useEncryption must be used within an EncryptionProvider');
  }
  return context;
};