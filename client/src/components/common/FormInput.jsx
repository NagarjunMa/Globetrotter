import React from 'react';

/**
 * Reusable form input component
 */
const FormInput = ({
    name,
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    required = false,
    className = '',
    ...props
}) => {
    // Determine if error should be shown
    const showError = touched && error;

    return (
        <div className={`mb-4 ${className}`}>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-gray-700 font-medium mb-2"
                >
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${showError
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-gray-300 focus:ring-blue-500'
                    }`}
                aria-invalid={showError ? 'true' : 'false'}
                aria-describedby={showError ? `${name}-error` : undefined}
                {...props}
            />

            {showError && (
                <p
                    id={`${name}-error`}
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default FormInput;