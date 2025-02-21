import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';

// Define the validation schema
const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  companyName: yup.string().required("Company name is required"),
  age: yup.number().positive().integer().required("Age is required"),
  dob: yup.date().required("Date of birth is required"),
  image: yup.mixed()
});

export default function Register() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { register, handleSubmit, formState: { errors }, setError } = useForm({
        resolver: yupResolver(registerSchema),
    });
    
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const formData = new FormData();
        
        try {
            // Log the data being sent
            console.log("Form data before sending:", data);
            
            // Append all form fields to FormData
            Object.keys(data).forEach((key) => {
                if (key === 'image' && data[key][0]) {
                    formData.append(key, data[key][0]);
                    console.log('Appending image:', data[key][0].name); // Log image info
                } else {
                    formData.append(key, data[key]);
                }
            });

            // Log FormData entries
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ', pair[1]);
            }

            const response = await axios.post('http://localhost:5001/api/auth/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                // Add timeout and better error handling
                timeout: 5000,
                validateStatus: function (status) {
                    return status >= 200 && status < 500;
                }
            });
            
            console.log("Response received:", response);

            if (response.status === 200 && response.data) {
                console.log("Registration successful:", response.data);
                router.push("/otp-verification");
            } else {
                throw new Error(response.data?.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                statusText: error.response?.statusText
            });
            
            if (error.response?.status === 500) {
                setError('root', {
                    type: 'manual',
                    message: 'Server error. Please contact support or try again later.'
                });
            } else if (error.response?.data?.message) {
                setError('root', {
                    type: 'manual',
                    message: error.response.data.message
                });
            } else {
                setError('root', {
                    type: 'manual',
                    message: 'Registration failed. Please try again.'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-black mb-4">Create Account</h2>
                
                {/* Display general form errors */}
                {errors.root && (
                    <p className="text-red-500 mb-4 p-3 bg-red-50 rounded">{errors.root.message}</p>
                )}

                <div className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            placeholder="Name" 
                            {...register("name")} 
                            className="w-full text-black p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <input 
                            type="email" 
                            placeholder="Email" 
                            {...register("email")} 
                            className="w-full p-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            {...register("password")} 
                            className="w-full text-black p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                        )}
                    </div>

                    <div>
                        <input 
                            type="text" 
                            placeholder="Company Name" 
                            {...register("companyName")} 
                            className="w-full p-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                    </div>

                    <div>
                        <input 
                            type="number" 
                            placeholder="Age" 
                            {...register("age")} 
                            className="w-full p-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                    </div>

                    <div>
                        <input 
                            type="date" 
                            {...register("dob")} 
                            className="w-full text-black p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                    </div>

                    <div>
                        <input 
                            type="file" 
                            accept="image/png, image/jpeg" 
                            {...register("image")} 
                            className="w-full p-2 text-black border rounded focus:outline-none focus:ring-2 focus:ring-green-500" 
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full py-2 rounded transition-colors ${
                            isSubmitting 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                    >
                        {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>
            </form>
        </div>
    );
}