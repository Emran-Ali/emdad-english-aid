import {db} from '@/@emran/lib/db';
import {hashPassword} from '@emran/lib/util/passwordManage';
import {photoUpload} from '@emran/lib/util/photoUpload';
import {users} from '@/db/schema/schema';
import {count, like, or} from 'drizzle-orm';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const password = await hashPassword(body.password);

    const photo = await photoUpload(body.profilePhoto, 'user');

    const newUser = await db.insert(users).values({
      name: body.name,
      email: body.email,
      contactNumber: body.contactNumber,
      password: password,
      profilePhoto: photo,
      role: body.role,
      address: body.address,
    });

    return new Response(
      JSON.stringify({message: 'User successfully created!', data: newUser}),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({message: 'Cannot create User!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};

export const GET = async (req) => {
  try {
    console.log('req receive');
    // Extract query parameters, e.g., id
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const per_page = parseInt(url.searchParams.get('per_page')) || 10;
    const search = url.searchParams.get('search') || '';

    if (userId) {
      // Fetch a specific user by ID
      const user = await db
        .select()
        .from(users)
        .where(users.id.eq(userId))
        .execute();

      if (!user.length) {
        return new Response(JSON.stringify({message: 'User not found!'}), {
          status: 404,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(
        JSON.stringify({message: 'User fetched successfully!', data: user[0]}),
        {status: 200, headers: {'Content-Type': 'application/json'}},
      );
    }

    const offset = (page - 1) * per_page;

    let total = 0;
    let query = db.select({count: count()}).from(users);
    let userQuery = db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        contactNumber: users.contactNumber,
        profilePhoto: users.profilePhoto,
        address: users.address,
      })
      .from(users);

    // Add search condition if search parameter exists and is not empty
    if (search && search.trim() !== '') {
      const searchCondition = or(
        like(users.name, `%${search.trim()}%`),
        like(users.email, `%${search.trim()}%`),
        like(users.contactNumber, `%${search.trim()}%`),
      );

      query = query.where(searchCondition);
      userQuery = userQuery.where(searchCondition);
    }

    const countResult = await query.execute();

    // Safely extract the count value
    if (countResult && countResult.length > 0) {
      total = countResult[0].count || 0;
    }

    const totalPages = Math.ceil(total / per_page);

    const allUsers = await userQuery.limit(per_page).offset(offset).execute();

    return new Response(
      JSON.stringify({
        message: 'Users fetched successfully!',
        data: allUsers,
        meta: {
          total,
          per_page,
          current_page: page,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_prev_page: page > 1,
        },
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(
      JSON.stringify({message: 'Cannot fetch users!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};
