import {batchSchedules} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {eq} from 'drizzle-orm';
import * as yup from 'yup';

const batchScheduleSchema = yup.object({
  batchId: yup.number().positive().integer().required('Batch ID is required'),
  dayOfWeek: yup
    .mixed()
    .oneOf(
      [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      'Invalid day',
    )
    .required('Day is required'),
  startTime: yup.string().required('Start time is required'),
  endTime: yup.string().required('End time is required'),
  room: yup.string().max(50),
});

async function validateSchedulePayload(payload) {
  try {
    const validated = await batchScheduleSchema.validate(payload, {
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
    const scheduleId = url.searchParams.get('id');

    if (scheduleId) {
      const schedule = await db
        .select()
        .from(batchSchedules)
        .where(eq(batchSchedules.id, Number(scheduleId)))
        .execute();

      if (!schedule.length) {
        return new Response(JSON.stringify({message: 'Schedule not found!'}), {
          status: 404,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(
        JSON.stringify({message: 'Schedule fetched', data: schedule[0]}),
        {status: 200, headers: {'Content-Type': 'application/json'}},
      );
    }

    if (batchId) {
      const schedules = await db
        .select()
        .from(batchSchedules)
        .where(eq(batchSchedules.batchId, Number(batchId)))
        .execute();

      return new Response(
        JSON.stringify({message: 'Schedules fetched', data: schedules}),
        {status: 200, headers: {'Content-Type': 'application/json'}},
      );
    }

    return new Response(
      JSON.stringify({message: 'batchId or id parameter required'}),
      {status: 400, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({message: 'Cannot get schedules!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};

export const POST = async (req) => {
  try {
    const body = await req.json();

    const {valid, data, errors} = await validateSchedulePayload(body);
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
      batchId: data.batchId,
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room || null,
    };

    const result = await db.insert(batchSchedules).values(payload).returning();

    return new Response(
      JSON.stringify({message: 'Schedule created successfully!', data: result}),
      {status: 201, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Cannot create schedule!',
        error: error.message,
      }),
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
        JSON.stringify({message: 'Schedule ID is required'}),
        {status: 400, headers: {'Content-Type': 'application/json'}},
      );
    }

    const {valid, data, errors} = await validateSchedulePayload(updateData);
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
      dayOfWeek: data.dayOfWeek,
      startTime: data.startTime,
      endTime: data.endTime,
      room: data.room || null,
    };

    const result = await db
      .update(batchSchedules)
      .set(payload)
      .where(eq(batchSchedules.id, Number(id)))
      .returning();

    if (!result.length) {
      return new Response(JSON.stringify({message: 'Schedule not found!'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      });
    }

    return new Response(
      JSON.stringify({message: 'Schedule updated successfully!', data: result}),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Cannot update schedule!',
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
        JSON.stringify({message: 'Schedule ID is required'}),
        {status: 400, headers: {'Content-Type': 'application/json'}},
      );
    }

    const result = await db
      .delete(batchSchedules)
      .where(eq(batchSchedules.id, Number(id)))
      .returning();

    if (!result.length) {
      return new Response(JSON.stringify({message: 'Schedule not found!'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      });
    }

    return new Response(
      JSON.stringify({message: 'Schedule deleted successfully!', data: result}),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: 'Cannot delete schedule!',
        error: error.message,
      }),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};
