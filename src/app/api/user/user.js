import { db } from '@/lib/db';
import { BatchTable } from '@/db/schema/schema';
import {hashPassword} from '@/lib/utile/passwordManage'

export const POST = async (req) => {
    try {
        const body = await req.json(); // Parse JSON from the request body

        const newBatch = await db.insert(BatchTable).values({
            name: body.name,
            email: body.students,
            contactNumber: body.year,
            password: hashPassword(body.batch_time), // Null if not provided
            role: body.batch_days_id || null, // Null if not provided
            addresh: body.type,
        });

        return new Response(
            JSON.stringify({ message: 'User successfully created!', data: newBatch }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Cannot create User!', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
