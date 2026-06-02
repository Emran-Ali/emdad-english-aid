import {bookings, batches, users, students, enrollments} from '@/db/schema/schema';
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

async function handleBookingConfirmation(booking) {
  if (booking.status !== 'confirmed') return;

  // Check if student user exists or needs creation
  let studentUserId = null;
  const existingUser = await db.select().from(users).where(eq(users.email, booking.studentEmail)).limit(1).execute();
  
  if (existingUser.length > 0) {
    studentUserId = existingUser[0].id;
  } else {
    // Note: We only create a user if they didn't exist AND we want to (this is usually handled in POST, 
    // but if an admin confirms a booking later, we might want to ensure a user exists if they checked 'createUser')
    // For now, let's assume we want to link to existing user if found.
  }

  let studentRecordId = null;
  if (studentUserId) {
    const studentRecord = await db.select().from(students).where(eq(students.userId, studentUserId)).limit(1).execute();
    if (studentRecord.length > 0) {
      studentRecordId = studentRecord[0].id;
    } else {
      // Create student record for user
      const newStudent = await db.insert(students).values({
        userId: studentUserId,
        studentId: `ST-${Date.now()}`,
      }).returning();
      studentRecordId = newStudent[0].id;
    }
  }

  // Create enrollment
  const batch = await db.select().from(batches).where(eq(batches.id, booking.batchId)).limit(1).execute();
  
  // Check if already enrolled to avoid duplicates
  const existingEnrollment = await db.select().from(enrollments).where(eq(enrollments.batchId, booking.batchId))
    .where(eq(enrollments.studentName, booking.studentName))
    .where(eq(enrollments.studentContact, booking.contactNumber))
    .limit(1).execute();

  if (existingEnrollment.length === 0) {
    await db.insert(enrollments).values({
      batchId: booking.batchId,
      studentId: studentRecordId,
      studentName: booking.studentName,
      studentContact: booking.contactNumber,
      totalAmount: batch[0]?.fees || "0",
      status: 'active'
    }).execute();

    if (batch[0]) {
      await db.update(batches).set({currentStudents: (batch[0].currentStudents || 0) + 1}).where(eq(batches.id, booking.batchId)).execute();
    }
  }
}

export const POST = async (req) => {
  try {
    const body = await req.json();
    const {batchId, studentName, studentEmail, contactNumber, createUser} = body;

    const session = await getServerSession(authOptions);
    const isAdminOrStaff = session && (session.user.role === 'admin' || session.user.role === 'staff');

    // Check if batch is accepting students
    const batch = await db.select().from(batches).where(eq(batches.id, batchId)).limit(1).execute();
    if (!isAdminOrStaff && (!batch[0] || !batch[0].isAcceptingStudents)) {
      return new Response(JSON.stringify({message: 'Batch is not accepting students'}), {status: 400});
    }

    // Handle user creation if requested
    if (createUser) {
      // Check if user already exists
      const existingUser = await db.select().from(users).where(eq(users.email, studentEmail)).limit(1).execute();
      if (existingUser.length === 0) {
        await db.insert(users).values({
          name: studentName,
          email: studentEmail,
          contactNumber: contactNumber,
          role: 'student',
          isActive: true,
        }).execute();
      }
    }

    const result = await db.insert(bookings).values({
      batchId,
      studentName,
      studentEmail,
      contactNumber,
      status: isAdminOrStaff ? (body.status || 'confirmed') : 'pending'
    }).returning();

    if (result[0].status === 'confirmed') {
      await handleBookingConfirmation(result[0]);
    }

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
    const {id, ...updateData} = body;
    const result = await db.update(bookings)
      .set(updateData)
      .where(eq(bookings.id, Number(id)))
      .returning();

    if (result[0] && result[0].status === 'confirmed') {
      await handleBookingConfirmation(result[0]);
    }

    return new Response(JSON.stringify({data: result[0]}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};
