import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { createBatch } from "@/service/BatchService";
import * as Yup from "yup";
import React from "react";
import {createUser} from "@/service/UserService";


// Define schema with Yup validation
const schema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    contactNumber: Yup.string().required('Contact number is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    role: Yup.string().required('Role is required'),
    address: Yup.string().required('Address is required'),
});

export default function CreateUser() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    })

    const onSubmit = async (data) => {
        const res = await createUser(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-gray-700">Profile Photo</label>
                    <input
                        type="file"
                        {...register('profilePhoto')}
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                </div>
                {/* Name field */}
                <div>
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        {...register('name')}
                        placeholder="Enter your name"
                        className="mt-1 p-2 border rounded w-full"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                    className="mt-1 p-2 border rounded w-full"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

            <div>
                <label className="block text-gray-700">Contact Number</label>
                <input
                    type="text"
                    {...register('contactNumber')}
                    placeholder="Enter your contact number"
                    className="mt-1 p-2 border rounded w-full"
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
                    className="mt-1 p-2 border rounded w-full"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            {/* Role */}
            <div>
                <label className="block text-gray-700">Role</label>
                <select
                    {...register('role')}
                    className="mt-1 p-2 border rounded w-full"
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
                    className="mt-1 p-2 border rounded w-full"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>


                <div className="col-span-12">
                    <button type="submit"
                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Submit
                    </button>
                </div>
            </div>
        </form>
    )
}
