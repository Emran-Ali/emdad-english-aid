import {enrollments, batchStaffAssignments, staff, payments, batches, users, students} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {eq, and, sql} from 'drizzle-orm';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

async function isAuthorizedForBatch(session, batchId) {
  if (session.user.role === 'admin') return true;
  if (session.user.role === 'staff') {
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

export const GET = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});

    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const enrollmentId = url.searchParams.get('enrollmentId');
    const batchId = url.searchParams.get('batchId');

    if (batchId) {
      // Fetch all enrollments for a specific batch
      const results = await db.select({
        enrollment: enrollments,
        student: students,
        user: users
      })
      .from(enrollments)
      .leftJoin(students, eq(enrollments.studentId, students.id))
      .leftJoin(users, eq(students.userId, users.id))
      .where(eq(enrollments.batchId, Number(batchId)))
      .execute();

      // For each enrollment, fetch payments
      const data = await Promise.all(results.map(async (r) => {
        const pms = await db.select().from(payments).where(eq(payments.paymentPlanId, r.enrollment.id)).execute();
        return { ...r, payments: pms };
      }));

      return new Response(JSON.stringify({data}), {status: 200});
    }

    if (userId) {
      // Fetch all enrollments for a specific user
      const studentRecord = await db.select().from(students).where(eq(students.userId, Number(userId))).limit(1).execute();
      if (!studentRecord.length) {
         return new Response(JSON.stringify({data: []}), {status: 200});
      }

      const results = await db.select({
        enrollment: enrollments,
        batch: batches
      })
      .from(enrollments)
      .leftJoin(batches, eq(enrollments.batchId, batches.id))
      .where(eq(enrollments.studentId, studentRecord[0].id))
      .execute();

      // For each enrollment, fetch payments
      const data = await Promise.all(results.map(async (r) => {
        const pms = await db.select().from(payments).where(eq(payments.paymentPlanId, r.enrollment.id)).execute();
        return { ...r, payments: pms };
      }));

      return new Response(JSON.stringify({data}), {status: 200});
    }

    if (enrollmentId) {
      const result = await db.select({
        enrollment: enrollments,
        batch: batches
      })
      .from(enrollments)
      .leftJoin(batches, eq(enrollments.batchId, batches.id))
      .where(eq(enrollments.id, Number(enrollmentId)))
      .limit(1)
      .execute();

      if (!result.length) return new Response(JSON.stringify({message: 'Not found'}), {status: 404});

      const pms = await db.select().from(payments).where(eq(payments.paymentPlanId, Number(enrollmentId))).execute();
      return new Response(JSON.stringify({data: { ...result[0], payments: pms }}), {status: 200});
    }

    return new Response(JSON.stringify({message: 'Missing parameters'}), {status: 400});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
}

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});

    const body = await req.json();
    const {batchId, studentId, studentName, studentContact, action, totalAmount} = body; // action: 'add', 'remove', 'refund', 'collect_payment'

    if (!await isAuthorizedForBatch(session, batchId)) {
      return new Response(JSON.stringify({message: 'Not authorized for this batch'}), {status: 403});
    }

    if (action === 'add') {
      const batch = await db.select().from(batches).where(eq(batches.id, batchId)).limit(1).execute();
      if (batch[0].currentStudents >= batch[0].maxStudents) {
        return new Response(JSON.stringify({message: 'Batch capacity full'}), {status: 400});
      }

      const result = await db.insert(enrollments).values({
        batchId,
        studentId: studentId ? Number(studentId) : null,
        studentName,
        studentContact,
        totalAmount: totalAmount || batch[0].fees,
        status: 'active'
      }).returning();
      
      await db.update(batches).set({currentStudents: (batch[0].currentStudents || 0) + 1}).where(eq(batches.id, batchId));

      return new Response(JSON.stringify({data: result[0]}), {status: 201});
    } else if (action === 'collect_payment') {
      const {enrollmentId, amount, paymentMethod, remarks, markAsPaid} = body;
      const enrollment = await db.select().from(enrollments).where(eq(enrollments.id, enrollmentId)).limit(1).execute();
      if (!enrollment.length) return new Response(JSON.stringify({message: 'Enrollment not found'}), {status: 404});

      const newPaidAmount = Number(enrollment[0].paidAmount || 0) + Number(amount);
      let paymentStatus = 'partial';
      if (markAsPaid || newPaidAmount >= Number(enrollment[0].totalAmount)) {
        paymentStatus = 'paid';
      }

      await db.insert(payments).values({
        paymentPlanId: enrollmentId,
        amount: amount,
        installmentNumber: 1, // Simplified
        dueDate: new Date(),
        paidDate: new Date(),
        paymentMethod: paymentMethod || 'cash',
        status: 'completed',
        remarks: remarks
      });

      const updated = await db.update(enrollments).set({
        paidAmount: newPaidAmount.toString(),
        paymentStatus: paymentStatus
      }).where(eq(enrollments.id, enrollmentId)).returning();

      return new Response(JSON.stringify({data: updated[0]}), {status: 200});
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
