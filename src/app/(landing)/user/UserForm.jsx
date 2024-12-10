'use client'
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

const UserForm = ({ defaultValues, onSubmit }) => {
    // Validation Schema with Yup
    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        contactNumber: Yup.string().required('Contact number is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        role: Yup.string().required('Role is required'),
        address: Yup.string().required('Address is required'),
    });

    // React Hook Form with Yup Resolver
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues,
    });

    return (
        <div className="max-w-xl mx-auto bg-white shadow-md p-6 rounded-lg">
            <h1 className="text-2xl font-bold mb-4">User Form</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Profile Photo */}
                <div>
                    <label className="block text-gray-700">Profile Photo</label>
                    <input
                        type="file"
                        {...register('profilePhoto')}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                </div>

                {/* Name */}
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        {...register('name')}
                        placeholder="Enter your name"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        placeholder="Enter your email"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                {/* Contact Number */}
                <div>
                    <label className="block text-gray-700">Contact Number</label>
                    <input
                        type="text"
                        {...register('contactNumber')}
                        placeholder="Enter your contact number"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.contactNumber && (
                        <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        {...register('password')}
                        placeholder="Enter your password"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                {/* Role */}
                <div>
                    <label className="block text-gray-700">Role</label>
                    <select
                        {...register('role')}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                </div>

                {/* Address */}
                <div>
                    <label className="block text-gray-700">Address</label>
                    <textarea
                        {...register('address')}
                        placeholder="Enter your address"
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserForm;
