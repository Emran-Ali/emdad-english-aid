import {batches} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {eq} from 'drizzle-orm';

export const GET = async (req) => {
  try {
    const list = await db
      .select({
        id: batches.id,
        title: batches.name,
        batchCode: batches.batchCode
      })
      .from(batches)
      .where(eq(batches.isActive, true))
      .execute();

    const formattedList = list.map(item => ({
      id: item.id,
      title: `${item.title} (${item.batchCode})`
    }));

    return new Response(
      JSON.stringify({
        message: 'Batches fetched for dropdown',
        data: formattedList,
      }),
      {status: 200, headers: {'Content-Type': 'application/json'}},
    );
  } catch (error) {
    return new Response(
      JSON.stringify({message: 'Cannot get dropdown data', error: error.message}),
      {status: 500, headers: {'Content-Type': 'application/json'}},
    );
  }
};
