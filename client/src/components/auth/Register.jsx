import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGlobeAmericas, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from './../../hooks/useAuth';
import Form from './../common/Form';
import FormInput from './../common/FormInput';
import { createFormValidation } from './../../utils/validation';

const Register = () => {
    const navigate = useNavigate();
    const { register, isAuthenticated, loading, error } = useAuth();
    const validationRules = createFormValidation();

    useEffect(() => {
        // Redirect if logged in
        if (isAuthenticated) {
            navigate('/game');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    const handleSubmit = async (formData) => {
        try {
            await register(formData.username, formData.password);
        } catch (err) {
            // Error is handled in useAuth hook and displayed via toast
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg p-6">
            <div className="text-center mb-8">
                <FaGlobeAmericas className="mx-auto text-4xl text-blue-600" />
                <h2 className="mt-4 text-3xl font-bold text-gray-800">Join Globetrotter</h2>
                <p className="mt-2 text-gray-600">Create an account to start your journey</p>
            </div>

            <Form
                initialValues={{
                    username: '',
                    password: '',
                    confirmPassword: ''
                }}
                validationRules={validationRules}
                onSubmit={handleSubmit}
            >
                {({ formData, errors, touched, isSubmitting, handleChange, handleBlur }) => (
                    <>
                        <FormInput
                            name="username"
                            label="Username"
                            value={formData.username}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.username}
                            touched={touched.username}
                            placeholder="Choose a unique username"
                            required
                            autoComplete="username"
                        />

                        <FormInput
                            name="password"
                            type="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.password}
                            touched={touched.password}
                            placeholder="Choose a password"
                            required
                            autoComplete="new-password"
                        />

                        <div className="mt-2 mb-4 text-sm">
                            <p className="text-gray-600 mb-1">Password must contain:</p>
                            <ul className="grid grid-cols-2 gap-1">
                                <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`inline-block w-3 h-3 mr-2 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                    Uppercase letter
                                </li>
                                <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`inline-block w-3 h-3 mr-2 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                    Lowercase letter
                                </li>
                                <li className={`flex items-center ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`inline-block w-3 h-3 mr-2 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                    Number
                                </li>
                                <li className={`flex items-center ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`inline-block w-3 h-3 mr-2 rounded-full ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                    Special character
                                </li>
                                <li className={`flex items-center ${formData.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                                    <span className={`inline-block w-3 h-3 mr-2 rounded-full ${formData.password.length >= 6 ? 'bg-green-600' : 'bg-gray-300'}`}></span>
                                    At least 6 characters
                                </li>
                            </ul>
                        </div>

                        <FormInput
                            name="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.confirmPassword}
                            touched={touched.confirmPassword}
                            placeholder="Confirm your password"
                            required
                            autoComplete="new-password"
                        />

                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center mt-6"
                        >
                            {isSubmitting || loading ? (
                                <span className="animate-spin mr-2">&#9696;</span>
                            ) : (
                                <FaUserPlus className="mr-2" />
                            )}
                            {isSubmitting || loading ? 'Creating Account...' : 'Register'}
                        </button>
                    </>
                )}
            </Form>

            <div className="mt-6 text-center">
                <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;