import { db } from '@/lib/db';
import { users} from '@/db/schema/schema';
import {hashPassword} from '@/lib/utile/passwordManage'

export const POST = async (req) => {
    
    try {
        const body = await req.json(); // Parse JSON from the request body
        const password = await hashPassword(body.password);
        console.log(password, 'body');
        const newUser = await db.insert(users).values({
            name: body.name,
            email: body.email,
            contactNumber: body.contactNumber,
            password: hashPassword(body.password),
            profilePhoto: body.profilePhoto,
            role: body.role ,
            address: body.address,
        });

        return new Response(
            JSON.stringify({ message: 'User successfully created!', data: newUser }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ message: 'Cannot create User!', error: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
