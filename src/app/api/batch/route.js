import {validateBatchPayload} from '@/@emran/service/validation/batch/batchValidation';
import {batches} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {count, eq} from 'drizzle-orm';

// Generate batchCode based on type and year, ensure uniqueness with timestamp suffix
const generateBatchCode = (type, year) => {
  const t = (type || 'batch')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');
  const y = year ? String(year) : String(new Date().getFullYear());
  const suffix = Date.now().toString().slice(-6);
  return `${t}-${y}-${suffix}`;
};

export const POST = async (req) => {
  try {
    const body = await req.json();

    // Validate payload server-side
    const {valid, data, errors} = await validateBatchPayload(body);
    if (!valid) {
      return new Response(
        JSON.stringify({message: 'Validation failed', errors}),
        {
          status: 422,
          headers: {'Content-Type': 'application/json'},
        },
      );
    }

    // Generate batchCode server-side based on type and academicYear
    const batchCode = generateBatchCode(data.type, data.academicYear);

    const payload = {
      batchCode,
      name: data.name,
      type: data.type,
      academicYear: data.academicYear,
      maxStudents: data.maxStudents,
      currentStudents: data.currentStudents || 0,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      batchTime: data.batchTime || null,
      fees: data.fees !== undefined ? data.fees : null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    const insertResult = await db.insert(batches).values(payload).returning();

    return new Response(
      JSON.stringify({
        message: 'Batch successfully created!',
        data: insertResult,
      }),
      {status: 201, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({message: 'Cannot create Batch!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};

export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const batchId = url.searchParams.get('id');
    const page = parseInt(url.searchParams.get('page')) || 1;
    const per_page = parseInt(url.searchParams.get('per_page')) || 10;
    const search = url.searchParams.get('search') || null;

    // get batch by id
    if (batchId) {
      const id = Number(batchId);
      const batchResult = await db
        .select()
        .from(batches)
        .where(batches.id.eq(id))
        .limit(1)
        .execute();

      if (!batchResult || batchResult.length === 0) {
        return new Response(JSON.stringify({message: 'Batch not found!'}), {
          status: 404,
          headers: {'Content-Type': 'application/json'},
        });
      }

      return new Response(
        JSON.stringify({
          message: 'Batch fetched successfully',
          data: batchResult[0],
        }),
        {status: 200, headers: {'Content-Type': 'application/json'}},
      );
    }

    const offset = (page - 1) * per_page;

    // Count total
    let total = 0;
    const countResult = await db
      .select({count: count()})
      .from(batches)
      .execute();
    if (countResult && countResult.length > 0)
      total = Number(countResult[0].count) || 0;

    const totalPages = Math.ceil(total / per_page) || 1;

    // Build base query — allow simple search by name
    let query = db.select().from(batches);
    if (search) {
      // drizzle doesn't support ilike here directly in this helper; using simple where name like
      query = query.where(batches.name.ilike(`%${search}%`));
    }

    const batchList = await query.limit(per_page).offset(offset).execute();

    return new Response(
      JSON.stringify({
        message: 'Batches fetched successfully',
        data: batchList,
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
    console.error('batch fetch error : ', error);
    return new Response(
      JSON.stringify({message: 'Cannot get Batches!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};

export const PUT = async (req) => {
  try {
    const body = await req.json();
    const {id, ...updateData} = body;

    if (!id) {
      return new Response(JSON.stringify({message: 'Batch ID is required'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    // Validate payload server-side
    const {valid, data, errors} = await validateBatchPayload(updateData);
    if (!valid) {
      return new Response(
        JSON.stringify({message: 'Validation failed', errors}),
        {status: 422, headers: {'Content-Type': 'application/json'}},
      );
    }

    const payload = {
      name: data.name,
      type: data.type,
      academicYear: data.academicYear,
      maxStudents: data.maxStudents,
      currentStudents: data.currentStudents || 0,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      batchTime: data.batchTime || null,
      fees: data.fees !== undefined ? data.fees : null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };

    const updateResult = await db
      .update(batches)
      .set(payload)
      .where(eq(batches.id, Number(id)))
      .returning();

    if (!updateResult || updateResult.length === 0) {
      return new Response(JSON.stringify({message: 'Batch not found!'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      });
    }

    return new Response(
      JSON.stringify({
        message: 'Batch updated successfully!',
        data: updateResult,
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({message: 'Cannot update Batch!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};

export const DELETE = async (req) => {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({message: 'Batch ID is required'}), {
        status: 400,
        headers: {'Content-Type': 'application/json'},
      });
    }

    const deleteResult = await db
      .delete(batches)
      .where(eq(batches.id, Number(id)))
      .returning();

    if (!deleteResult || deleteResult.length === 0) {
      return new Response(JSON.stringify({message: 'Batch not found!'}), {
        status: 404,
        headers: {'Content-Type': 'application/json'},
      });
    }

    return new Response(
      JSON.stringify({
        message: 'Batch deleted successfully!',
        data: deleteResult,
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({message: 'Cannot delete Batch!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};
