import {enrollments, batchStaffAssignments, staff, payments, batches} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {eq, and} from 'drizzle-orm';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

async function isAuthorizedForBatch(session, batchId) {
  if (session.user.role === 'admin') return true;
  if (session.user.role === 'staff') {
    // Check if staff is assigned to this batch
    const staffRecord = await db.select().from(staff).where(eq(staff.userId, session.user.id)).limit(1).execute();
    if (!staffRecord.length) return false;
    
    const assignment = await db.select().from(batchStaffAssignments)
      .where(and(
        eq(batchStaffAssignments.batchId, batchId),
        eq(batchStaffAssignments.staffId, staffRecord[0].id)
      )).limit(1).execute();
    return assignment.length > 0;
  }
  return false;
}

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});

    const body = await req.json();
    const {batchId, studentId, action} = body; // action: 'add', 'remove', 'refund'

    if (!await isAuthorizedForBatch(session, batchId)) {
      return new Response(JSON.stringify({message: 'Not authorized for this batch'}), {status: 403});
    }

    if (action === 'add') {
      const result = await db.insert(enrollments).values({
        batchId,
        studentId,
        status: 'active'
      }).returning();
      
      // Increment currentStudents in batches
      const batch = await db.select().from(batches).where(eq(batches.id, batchId)).limit(1).execute();
      await db.update(batches).set({currentStudents: (batch[0].currentStudents || 0) + 1}).where(eq(batches.id, batchId));

      return new Response(JSON.stringify({data: result[0]}), {status: 201});
    } else if (action === 'remove') {
      const result = await db.update(enrollments)
        .set({status: 'dropped', deleted_at: new Date()})
        .where(and(eq(enrollments.batchId, batchId), eq(enrollments.studentId, studentId)))
        .returning();
      
      // Decrement currentStudents in batches
      const batch = await db.select().from(batches).where(eq(batches.id, batchId)).limit(1).execute();
      await db.update(batches).set({currentStudents: Math.max(0, (batch[0].currentStudents || 0) - 1)}).where(eq(batches.id, batchId));

      return new Response(JSON.stringify({data: result[0]}), {status: 200});
    } else if (action === 'refund') {
        const {amount, remarks} = body;
        // In a real system, we'd record a negative payment or update an existing one
        // For now, let's add a remark to the enrollment and record it in expenses as a refund
        await db.insert(payments).values({
            amount: -amount,
            status: 'completed',
            remarks: `REFUND: ${remarks}`,
            paymentPlanId: 0, // Should link to actual plan, but simplifying for PoC
            installmentNumber: 0,
            dueDate: new Date(),
        });
        return new Response(JSON.stringify({message: 'Refund recorded'}), {status: 200});
    }

    return new Response(JSON.stringify({message: 'Invalid action'}), {status: 400});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};
