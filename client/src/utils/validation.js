/**
 * Validates username
 * @param {string} username - Username to validate
 * @returns {Object} Validation result with isValid flag and message
 */
export const validateUsername = (username) => {
    if (!username) {
      return { isValid: false, message: 'Username is required' };
    }
    
    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters' };
    }
    
    if (username.length > 30) {
      return { isValid: false, message: 'Username cannot exceed 30 characters' };
    }
    
    // Check for valid characters (letters, numbers, underscores, hyphens)
    const validUsernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validUsernameRegex.test(username)) {
      return { 
        isValid: false, 
        message: 'Username can only contain letters, numbers, underscores, and hyphens' 
      };
    }
    
    return { isValid: true };
  };
  
  /**
   * Validates password
   * @param {string} password - Password to validate
   * @returns {Object} Validation result with isValid flag, message, and detailed checks
   */
  export const validatePassword = (password) => {
    if (!password) {
      return { 
        isValid: false, 
        message: 'Password is required',
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
        hasMinLength: false
      };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const hasMinLength = password.length >= 6;
    
    const isValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;
    
    let message = '';
    if (!isValid) {
      const missing = [];
      if (!hasUpperCase) missing.push('an uppercase letter');
      if (!hasLowerCase) missing.push('a lowercase letter');
      if (!hasNumber) missing.push('a number');
      if (!hasSpecialChar) missing.push('a special character');
      if (!hasMinLength) missing.push('at least 6 characters');
      
      message = `Password must contain ${missing.join(', ')}`;
    }
    
    return {
      isValid,
      message,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar,
      hasMinLength
    };
  };
  
  /**
   * Validates form data
   * @param {Object} data - Form data to validate
   * @param {Object} rules - Validation rules
   * @returns {Object} Validation results with errors object
   */
  export const validateForm = (data, rules) => {
    const errors = {};
    let isValid = true;
    
    Object.keys(rules).forEach(field => {
      const value = data[field];
      const fieldRules = rules[field];
      
      // Required rule
      if (fieldRules.required && (!value || value === '')) {
        errors[field] = fieldRules.requiredMessage || `${field} is required`;
        isValid = false;
        return;
      }
      
      // Min length rule
      if (fieldRules.minLength && value && value.length < fieldRules.minLength) {
        errors[field] = fieldRules.minLengthMessage || 
          `${field} must be at least ${fieldRules.minLength} characters`;
        isValid = false;
        return;
      }
      
      // Max length rule
      if (fieldRules.maxLength && value && value.length > fieldRules.maxLength) {
        errors[field] = fieldRules.maxLengthMessage || 
          `${field} cannot exceed ${fieldRules.maxLength} characters`;
        isValid = false;
        return;
      }
      
      // Pattern rule
      if (fieldRules.pattern && value && !fieldRules.pattern.test(value)) {
        errors[field] = fieldRules.patternMessage || `${field} format is invalid`;
        isValid = false;
        return;
      }
      
      // Custom validator
      if (fieldRules.validator && typeof fieldRules.validator === 'function') {
        const validationResult = fieldRules.validator(value, data);
        if (validationResult !== true) {
          errors[field] = validationResult || `${field} is invalid`;
          isValid = false;
          return;
        }
      }
    });
    
    return { isValid, errors };
  };
  
  /**
   * Creates validation rules for a form
   * @returns {Object} Form validation rules object
   */
  export const createFormValidation = () => {
    return {
      username: {
        required: true,
        requiredMessage: 'Username is required',
        minLength: 3,
        minLengthMessage: 'Username must be at least 3 characters',
        maxLength: 30,
        maxLengthMessage: 'Username cannot exceed 30 characters',
        pattern: /^[a-zA-Z0-9_-]+$/,
        patternMessage: 'Username can only contain letters, numbers, underscores, and hyphens'
      },
      password: {
        required: true,
        requiredMessage: 'Password is required',
        validator: (value) => {
          const validation = validatePassword(value);
          return validation.isValid || validation.message;
        }
      },
      confirmPassword: {
        required: true,
        requiredMessage: 'Please confirm your password',
        validator: (value, data) => {
          return value === data.password || 'Passwords do not match';
        }
      }
    };
  };