export async function createBatch(batchData) {
    console.log('User call')
        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batchData),
        });
    console.log(response, 'repose');

        if (!response.ok) {
            alert('Failed to create User');
        }
        alert(response.message);
}
