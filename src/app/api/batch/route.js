import {batchTable} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {count} from 'drizzle-orm';

export const POST = async (req) => {
  try {
    const body = await req.json();
    const newBatch = await db.insert(batchTable).values({
      name: body.name,
      students: body.students,
      year: body.year,
      batch_time: body.batch_time || null, // Null if not provided
      batch_days_id: body.batch_days_id || null, // Null if not provided
      type: body.type,
      status: true, // Set to true or as needed
    });

    return new Response(
      JSON.stringify({message: 'Batch successfully created!', data: newBatch}),
      {status: 200, headers: {'Content-Type': 'application/json'}},
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
    const search = url.searchParams.get('search');
    //get batch by id
    if (batchId) {
      const batch = await db
        .select()
        .from(batchTable)
        .where(batchTable.id.eq(batchId))
        .execute();

      if (!batch.length) {
        return new Response(JSON.stringify({message: 'Batch not found!'}), {
          status: 404,
        });
      }

      return new Response(
        JSON.stringify({message: 'Batch fetched successfully', data: batch}),
        {status: 200},
      );
    }

    const offset = (page - 1) * per_page;

    let total = 0;
    const countResult = await db
      .select({count: count()})
      .from(batchTable)
      .execute();

    // Safely extract the count value
    if (countResult && countResult.length > 0) {
      total = countResult[0].count || 0;
    }

    const totalPages = Math.ceil(total / per_page);

    // Get paginated data
    const batches = await db
      .select()
      .from(batchTable)
      .limit(per_page)
      .offset(offset)
      .execute();

    return new Response(
      JSON.stringify({
        message: 'Batches fetched successfully',
        data: batches,
        meta: {
          total,
          per_page,
          current_page: page,
          total_pages: totalPages,
          has_next_page: page < totalPages,
          has_prev_page: page > 1,
        },
      }),
      {status: 200},
    );
  } catch (error) {
    console.log(error);

    return new Response(
      JSON.stringify({message: 'Cannot get Batches!', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};
