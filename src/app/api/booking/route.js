import {bookings, batches} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {eq} from 'drizzle-orm';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }

    const data = await db.select().from(bookings).execute();
    return new Response(JSON.stringify({data}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();
    const {batchId, studentName, studentEmail, contactNumber} = body;

    const session = await getServerSession(authOptions);
    const isAdminOrStaff = session && (session.user.role === 'admin' || session.user.role === 'staff');

    // Check if batch is accepting students
    const batch = await db.select().from(batches).where(eq(batches.id, batchId)).limit(1).execute();
    if (!isAdminOrStaff && (!batch[0] || !batch[0].isAcceptingStudents)) {
      return new Response(JSON.stringify({message: 'Batch is not accepting students'}), {status: 400});
    }

    const result = await db.insert(bookings).values({
      batchId,
      studentName,
      studentEmail,
      contactNumber,
      status: isAdminOrStaff ? (body.status || 'confirmed') : 'pending'
    }).returning();

    return new Response(JSON.stringify({data: result[0]}), {status: 201});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};

export const PUT = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'staff')) {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }

    const body = await req.json();
    const {id, status} = body;
    const result = await db.update(bookings)
      .set({status})
      .where(eq(bookings.id, id))
      .returning();

    return new Response(JSON.stringify({data: result[0]}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};
