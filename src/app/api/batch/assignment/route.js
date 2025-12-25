import {batchStaffAssignments, staff, users} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {eq} from 'drizzle-orm';
import * as yup from 'yup';

const staffAssignmentSchema = yup.object({
  batchId: yup.number().positive().integer().required('Batch ID is required'),
  staffId: yup.number().positive().integer().required('Staff ID is required'),
  role: yup
    .mixed()
    .oneOf(['instructor', 'coordinator', 'assistant'], 'Invalid role')
    .required('Role is required'),
  isActive: yup.boolean().default(true),
});

async function validateAssignmentPayload(payload) {
  try {
    const validated = await staffAssignmentSchema.validate(payload, {
      abortEarly: false,
      stripUnknown: true,
    });
    return {valid: true, data: validated, errors: null};
  } catch (err) {
    if (err.inner && Array.isArray(err.inner)) {
      const errors = err.inner.reduce((acc, cur) => {
        if (cur.path) acc[cur.path] = cur.message;
        return acc;
      }, {});
      return {valid: false, data: null, errors};
    }
    return {valid: false, data: null, errors: {message: err.message}};
  }
}

export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const batchId = url.searchParams.get('batchId');
    const assignmentId = url.searchParams.get('id');

    if (assignmentId) {
      const assignment = await db
        .select()
        .from(batchStaffAssignments)
        .where(eq(batchStaffAssignments.id, Number(assignmentId)))
        .execute();

      if (!assignment.length) {
        return new Response(
          JSON.stringify({message: 'Assignment not found!'}),
          {status: 404, headers: {'Content-Type': 'application/json'}},
        );
      }

      return new Response(
        JSON.stringify({message: 'Assignment fetched', data: assignment[0]}),
        {status: 200, headers: {'Content-Type': 'application/json'}},
      );
    }

    if (batchId) {
      const assignments = await db
        .select({
          id: batchStaffAssignments.id,
          batchId: batchStaffAssignments.batchId,
          staffId: batchStaffAssignments.staffId,
          role: batchStaffAssignments.role,
          assignedDate: batchStaffAssignments.assignedDate,
          isActive: batchStaffAssignments.isActive,
          staffName: users.name,
          staffEmail: users.email,
        })
        .from(batchStaffAssignments)
        .innerJoin(staff, eq(batchStaffAssignments.staffId, staff.id))
        .innerJoin(users, eq(staff.userId, users.id))
        .where(eq(batchStaffAssignments.batchId, Number(batchId)))
        .execute();

      return new Response(
        JSON.stringify({message: 'Assignments fetched', data: assignments}),
        {status: 200, headers: {'Content-Type': 'application/json'}},
      );
    }

    return new Response(
      JSON.stringify({message: 'batchId or id parameter required'}),
      {status: 400, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Cannot get assignments!',
        error: error.message,
      }),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};

// GET all staff users (to populate dropdown)
export const getStaffUsers = async () => {
  try {
    const staffUsers = await db
      .select({
        id: staff.id,
        userId: staff.userId,
        name: users.name,
        email: users.email,
        designation: staff.designation,
      })
      .from(staff)
      .innerJoin(users, eq(staff.userId, users.id))
      .execute();

    return staffUsers;
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();

    const {valid, data, errors} = await validateAssignmentPayload(body);
    if (!valid) {
      return new Response(
        JSON.stringify({message: 'Validation failed', errors}),
        {
          status: 422,
          headers: {'Content-Type': 'application/json'},
        },
      );
    }

    // Check if staff exists
    const staffExists = await db
      .select()
      .from(staff)
      .where(eq(staff.id, data.staffId))
      .execute();

    if (!staffExists.length) {
      return new Response(JSON.stringify({message: 'Staff not found!'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const payload = {
      batchId: data.batchId,
      staffId: data.staffId,
      role: data.role,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    const result = await db
      .insert(batchStaffAssignments)
      .values(payload)
      .returning();

    return new Response(
      JSON.stringify({message: 'Staff assigned successfully!', data: result}),
      {status: 201, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({message: 'Cannot assign staff!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};

export const PUT = async (req) => {
  try {
    const body = await req.json();
    const {id, ...updateData} = body;

    if (!id) {
      return new Response(
        JSON.stringify({message: 'Assignment ID is required'}),
        {status: 400, headers: {'Content-Type': 'application/json'}},
      );
    }

    const {valid, data, errors} = await validateAssignmentPayload(updateData);
    if (!valid) {
      return new Response(
        JSON.stringify({message: 'Validation failed', errors}),
        {
          status: 422,
          headers: {'Content-Type': 'application/json'},
        },
      );
    }

    const payload = {
      role: data.role,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    const result = await db
      .update(batchStaffAssignments)
      .set(payload)
      .where(eq(batchStaffAssignments.id, Number(id)))
      .returning();

    if (!result.length) {
      return new Response(JSON.stringify({message: 'Assignment not found!'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      });
    }

    return new Response(
      JSON.stringify({
        message: 'Assignment updated successfully!',
        data: result,
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Cannot update assignment!',
        error: error.message,
      }),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};

export const DELETE = async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(
        JSON.stringify({message: 'Assignment ID is required'}),
        {status: 400, headers: {'Content-Type': 'application/json'}},
      );
    }

    const result = await db
      .delete(batchStaffAssignments)
      .where(eq(batchStaffAssignments.id, Number(id)))
      .returning();

    if (!result.length) {
      return new Response(JSON.stringify({message: 'Assignment not found!'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      });
    }

    return new Response(
      JSON.stringify({
        message: 'Assignment deleted successfully!',
        data: result,
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Cannot delete assignment!',
        error: error.message,
      }),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};
