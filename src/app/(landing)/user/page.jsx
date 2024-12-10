'use client'
import React from 'react';
import UserForm from './UserForm';
import { createBatch } from '@/service/UserService'

const User = () => {
    const defaultValues = {
        profilePhoto: null,
        name: '',
        email: '',
        contactNumber: '',
        password: '',
        role: '',
        address: '',
    };

    const handleSubmit = (data) => {
        createBatch(data);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <UserForm defaultValues={defaultValues} onSubmit={handleSubmit} />
        </div>
    );
};

export default User;

