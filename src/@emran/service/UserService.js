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
            alert('Failed to create User');
        }
        alert(response.message);
}
