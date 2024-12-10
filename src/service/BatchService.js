export async function createBatch(batchData) {
    console.log('method call')
        const response = await fetch('/api/batch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(batchData),
        });
    console.log(response, 'repose');

        if (!response.ok) {
            alert('Failed to create batch');
        }
        alert(response.message);
}
