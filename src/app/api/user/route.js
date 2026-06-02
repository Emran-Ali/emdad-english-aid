import {db} from '@/@emran/lib/db';
import {users} from '@/db/schema/schema';
import {hashPassword} from '@emran/lib/util/passwordManage';
import {photoUpload} from '@emran/lib/util/photoUpload';
import {count, like, or, eq, and} from 'drizzle-orm';
import {getServerSession} from 'next-auth';
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import {NextResponse} from "next/server";

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {error: 'Unauthorized. Please login first.'},
        {status: 401},
      );
    }

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
    const url = new URL(req.url);
    const userId = url.searchParams.get('id');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const per_page_param = url.searchParams.get('per_page');
    const per_page = per_page_param === '-1' ? 1000 : parseInt(per_page_param) || 10;
    const role = url.searchParams.get('role');
    const search = url.searchParams.get('search') || '';

    if (userId) {
      // Fetch a specific user by ID
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(userId)))
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
        role: users.role,
      })
      .from(users);

    // Filter by role
    if (role) {
      query = query.where(eq(users.role, role));
      userQuery = userQuery.where(eq(users.role, role));
    }

    // Add search condition if search parameter exists and is not empty
    if (search && search.trim() !== '') {
      const searchCondition = or(
        like(users.name, `%${search.trim()}%`),
        like(users.email, `%${search.trim()}%`),
        like(users.contactNumber, `%${search.trim()}%`),
      );
      
      if (role) {
        const combinedCondition = and(eq(users.role, role), searchCondition);
        query = query.where(combinedCondition);
        userQuery = userQuery.where(combinedCondition);
      } else {
        query = query.where(searchCondition);
        userQuery = userQuery.where(searchCondition);
      }
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

export const PUT = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }

    const body = await req.json();

    if (session.user.role !== 'admin' && session.user.role !== 'staff' && session.user.id !== Number(body.id)) {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }
    const {id, password, profilePhoto, ...updateData} = body;

    if (password) {
      updateData.password = await hashPassword(password);
    }

    if (profilePhoto && profilePhoto.startsWith('data:')) {
      updateData.profilePhoto = await photoUpload(profilePhoto, 'user');
    }

    const result = await db.update(users)
      .set(updateData)
      .where(eq(users.id, Number(id)))
      .returning();

    return new Response(JSON.stringify({data: result[0]}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};

export const DELETE = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    await db.delete(users).where(eq(users.id, Number(id)));
    return new Response(JSON.stringify({message: 'User deleted successfully!'}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};
