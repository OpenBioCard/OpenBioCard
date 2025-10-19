import React, { useState, useCallback } from 'react';
import { InputSanitizer } from '../utils/inputSanitizer';

interface SecureInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSecureChange?: (value: string, isValid: boolean) => void;
  sanitizeType?: 'input' | 'username' | 'filename';
  validateSQL?: boolean;
  validateNoSQL?: boolean;
  maxLength?: number;
}

export const SecureInput: React.FC<SecureInputProps> = ({
  onSecureChange,
  sanitizeType = 'input',
  validateSQL = true,
  validateNoSQL = true,
  maxLength = 255,
  className = '',
  ...props
}) => {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    let valid = true;
    let errorMessage = '';

    // 長度檢查
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
      errorMessage = `Maximum length is ${maxLength} characters`;
      valid = false;
    }

    // SQL注入檢測
    if (validateSQL && InputSanitizer.detectSQLInjection(inputValue)) {
      errorMessage = 'Potential SQL injection detected';
      valid = false;
    }

    // NoSQL注入檢測  
    if (validateNoSQL && typeof inputValue === 'object') {
      if (InputSanitizer.detectNoSQLInjection(inputValue)) {
        errorMessage = 'Potential NoSQL injection detected';
        valid = false;
      }
    }

    // 根據類型進行清理
    let sanitizedValue = inputValue;
    switch (sanitizeType) {
      case 'username':
        sanitizedValue = InputSanitizer.sanitizeUsername(inputValue);
        break;
      case 'filename':
        sanitizedValue = InputSanitizer.sanitizeFilename(inputValue);
        break;
      case 'input':
      default:
        sanitizedValue = InputSanitizer.sanitizeInput(inputValue);
        break;
    }

    // 如果清理後的值與原值不同，說明包含危險字符
    if (sanitizedValue !== inputValue) {
      errorMessage = 'Invalid characters removed';
      valid = false;
    }

    setValue(sanitizedValue);
    setIsValid(valid);
    setError(errorMessage);

    if (onSecureChange) {
      onSecureChange(sanitizedValue, valid);
    }
  }, [sanitizeType, validateSQL, validateNoSQL, maxLength, onSecureChange]);

  return (
    <div className="relative">
      <input
        {...props}
        value={value}
        onChange={handleChange}
        className={`${className} ${!isValid ? 'border-red-500 focus:border-red-500' : ''}`}
        aria-invalid={!isValid}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <div 
          id={`${props.id}-error`}
          className="absolute text-red-500 text-xs mt-1"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

interface SecureTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSecureChange?: (value: string, isValid: boolean) => void;
  sanitizeHTML?: boolean;
  maxLength?: number;
}

export const SecureTextArea: React.FC<SecureTextAreaProps> = ({
  onSecureChange,
  sanitizeHTML = true,
  maxLength = 1000,
  className = '',
  ...props
}) => {
  const [value, setValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;
    let valid = true;
    let errorMessage = '';

    // 長度檢查
    if (inputValue.length > maxLength) {
      inputValue = inputValue.substring(0, maxLength);
      errorMessage = `Maximum length is ${maxLength} characters`;
      valid = false;
    }

    // SQL注入檢測
    if (InputSanitizer.detectSQLInjection(inputValue)) {
      errorMessage = 'Potential SQL injection detected';
      valid = false;
    }

    // HTML清理
    let sanitizedValue = inputValue;
    if (sanitizeHTML) {
      sanitizedValue = InputSanitizer.sanitizeHTML(inputValue);
      if (sanitizedValue !== inputValue) {
        errorMessage = 'Potentially dangerous HTML removed';
        valid = false;
      }
    } else {
      sanitizedValue = InputSanitizer.sanitizeInput(inputValue);
      if (sanitizedValue !== inputValue) {
        errorMessage = 'Invalid characters removed';
        valid = false;
      }
    }

    setValue(sanitizedValue);
    setIsValid(valid);
    setError(errorMessage);

    if (onSecureChange) {
      onSecureChange(sanitizedValue, valid);
    }
  }, [sanitizeHTML, maxLength, onSecureChange]);

  return (
    <div className="relative">
      <textarea
        {...props}
        value={value}
        onChange={handleChange}
        className={`${className} ${!isValid ? 'border-red-500 focus:border-red-500' : ''}`}
        aria-invalid={!isValid}
        aria-describedby={error ? `${props.id}-error` : undefined}
      />
      {error && (
        <div 
          id={`${props.id}-error`}
          className="absolute text-red-500 text-xs mt-1"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
};

interface SecureFormProps {
  children: React.ReactNode;
  onSecureSubmit?: (data: any, isValid: boolean) => void;
  className?: string;
}

export const SecureForm: React.FC<SecureFormProps> = ({
  children,
  onSecureSubmit,
  className = ''
}) => {
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: any = {};
    let isValid = true;

    // 收集並驗證表單數據
    for (const [key, value] of formData.entries()) {
      if (typeof value === 'string') {
        // 檢測注入攻擊
        if (InputSanitizer.detectSQLInjection(value)) {
          console.warn(`SQL injection detected in field: ${key}`);
          isValid = false;
        }
        
        // 清理數據
        data[key] = InputSanitizer.sanitizeInput(value);
      } else {
        data[key] = value;
      }
    }

    // 清理整個數據對象
    const sanitizedData = InputSanitizer.sanitizeJSON(data);

    if (onSecureSubmit) {
      onSecureSubmit(sanitizedData, isValid);
    }
  }, [onSecureSubmit]);

  return (
    <form onSubmit={handleSubmit} className={className} noValidate>
      {children}
    </form>
  );
};