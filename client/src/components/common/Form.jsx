import React, { useState } from 'react';
import { validateForm } from '../../utils/validation';

/**
 * Reusable form component with validation
 */
const Form = ({
    initialValues = {},
    validationRules = {},
    onSubmit,
    children
}) => {
    const [formData, setFormData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        // Mark field as touched
        if (!touched[name]) {
            setTouched({
                ...touched,
                [name]: true
            });
        }

        // Validate field on change if it's been touched
        if (touched[name]) {
            const fieldValidation = validateForm(
                { [name]: value },
                { [name]: validationRules[name] }
            );

            setErrors({
                ...errors,
                [name]: fieldValidation.errors[name] || null
            });
        }
    };

    // Handle field blur
    const handleBlur = (e) => {
        const { name, value } = e.target;

        // Mark field as touched
        setTouched({
            ...touched,
            [name]: true
        });

        // Validate field on blur
        const fieldValidation = validateForm(
            { [name]: value },
            { [name]: validationRules[name] }
        );

        setErrors({
            ...errors,
            [name]: fieldValidation.errors[name] || null
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
        const validation = validateForm(formData, validationRules);

        // Mark all fields as touched
        const allTouched = Object.keys(validationRules).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});

        setTouched(allTouched);
        setErrors(validation.errors);

        if (validation.isValid) {
            setIsSubmitting(true);

            try {
                await onSubmit(formData);
            } catch (error) {
                // Form-level error handling here if needed
                console.error('Form submission error:', error);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // Provide form context to children
    const formContext = {
        formData,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        setFormData
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            {typeof children === 'function' ? children(formContext) : children}
        </form>
    );
};

export default Form;