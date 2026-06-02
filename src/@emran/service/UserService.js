import toast from 'react-hot-toast';

export async function createUser(userData) {
    console.log('User call')
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            toast.error('Failed to create User');
            return;
        }
        toast.success('User created successfully');
}
