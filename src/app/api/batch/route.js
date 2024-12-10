import { db } from '@/lib/db';
import { BatchTable } from '@/db/schema/schema';

export const POST = async (req) => {
    try {
        const body = await req.json(); // Parse JSON from the request body

        const newBatch = await db.insert(BatchTable).values({
            name: body.name,
            students: body.students,
            year: body.year,
            batch_time: body.batch_time || null, // Null if not provided
            batch_days_id: body.batch_days_id || null, // Null if not provided
            type: body.type,
            status: true, // Set to true or as needed
        });

        return new Response(
            JSON.stringify({ message: 'Batch successfully created!', data: newBatch }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Cannot create Batch!', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
