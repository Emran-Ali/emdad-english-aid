import { db } from '@/@emran/lib/db';
import { users} from '@/db/schema/schema';
import {hashPassword} from '@/@emran/lib/utile/passwordManage'

export const POST = async (req) => {
    
    try {
        const body = await req.json(); // Parse JSON from the request body
        const password = await hashPassword(body.password);
        console.log(password, password);
        console.log(body.password)
        const newUser = await db.insert(users).values({
            name: body.name,
            email: body.email,
            contactNumber: body.contactNumber,
            password: password,
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

export const GET = async (req) => {
    console.log(req, 'request');
    try {
        // Extract query parameters, e.g., id
        const url = new URL(req.url);
        const userId = url.searchParams.get('id');
        const page = url.searchParams.get('page');
        const per_page = url.searchParams.get('per_page');
        const search = url.searchParams.get('search');


        if (userId) {
            // Fetch a specific user by ID
            const user = await db.select().from(users).where(users.id.eq(userId)).execute();

            if (!user.length) {
                return new Response(
                  JSON.stringify({ message: 'User not found!' }),
                  { status: 404, headers: { 'Content-Type': 'application/json' } }
                );
            }

            return new Response(
              JSON.stringify({ message: 'User fetched successfully!', data: user[0] }),
              { status: 200, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Fetch all users if no ID is provided
        const allUsers = await db.select().from(users).execute();

        return new Response(
          JSON.stringify({ message: 'Users fetched successfully!', data: allUsers }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        return new Response(
          JSON.stringify({ message: 'Cannot fetch users!', error: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
