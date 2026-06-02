import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup";
import React from "react";
import {createUser} from "@service/UserService";

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
                    <label className="block text-cyan-300">Profile Photo</label>
                    <input
                        type="file"
                        {...register('profilePhoto')}
                        className="mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    {errors.type && <p className="text-red-500 text-sm">{errors.type.message}</p>}
                </div>
                {/* Name field */}
                <div>
                    <label className="block text-cyan-300">Name</label>
                    <input
                        type="text"
                        {...register('name')}
                        placeholder="Enter your name"
                        className="mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-cyan-600/50"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-cyan-300">Email</label>
                    <input
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                    className="mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-cyan-600/50"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div>
                <label className="block text-cyan-300">Contact Number</label>
                <input
                    type="text"
                    {...register('contactNumber')}
                    placeholder="Enter your contact number"
                    className="mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-cyan-600/50"
                />
                {errors.contactNumber && (
                    <p className="text-red-500 text-sm">{errors.contactNumber.message}</p>
                )}
                </div>

            {/* Password */}
                <div>
                <label className="block text-cyan-300">Password</label>
                <input
                    type="password"
                    {...register('password')}
                    placeholder="Enter your password"
                    className="mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-cyan-600/50"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

            {/* Role */}
                <div>
                <label className="block text-cyan-300">Role</label>
                <select
                    {...register('role')}
                    className="mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full focus:outline-none focus:border-cyan-500 transition-colors"
                >
                    <option value="" className="bg-cyan-950">Select Role</option>
                    <option value="admin" className="bg-cyan-950">Admin</option>
                    <option value="editor" className="bg-cyan-950">Editor</option>
                    <option value="viewer" className="bg-cyan-950">Viewer</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                </div>

            {/* Address */}
                <div className="col-span-2">
                <label className="block text-cyan-300">Address</label>
                <textarea
                    {...register('address')}
                    placeholder="Enter your address"
                    className="mt-1 p-2 bg-cyan-900/50 border border-cyan-700/50 text-cyan-100 rounded-lg w-full h-10 focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-cyan-600/50"
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                </div>


                <div className="col-span-3">
                    <button type="submit"
                            className="mt-4 px-8 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-500 font-bold transition-all shadow-lg shadow-cyan-900/20">
                        Submit
                    </button>
                </div>

            </div>
        </form>
    )
}
