import {reviews} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {eq, and} from 'drizzle-orm';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req) => {
  try {
    const url = new URL(req.url);
    const onlyShown = url.searchParams.get('onlyShown') === 'true';

    let query = db.select().from(reviews);
    if (onlyShown) {
      query = query.where(eq(reviews.isShown, true));
    }

    const data = await query.execute();
    return new Response(JSON.stringify({data}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }

    const body = await req.json();
    const payload = {
      studentId: body.studentId || null,
      reviewerName: body.reviewerName || session.user.name,
      reviewerHandle: body.reviewerHandle || '',
      content: body.content,
      rating: body.rating || 5,
      isShown: (session.user.role === 'admin' || session.user.role === 'staff') ? (body.isShown ?? true) : false,
    };

    const result = await db.insert(reviews).values(payload).returning();
    return new Response(JSON.stringify({data: result[0]}), {status: 201});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};

export const PUT = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }

    const body = await req.json();
    const {id, isShown} = body;

    const result = await db.update(reviews)
      .set({isShown})
      .where(eq(reviews.id, id))
      .returning();

    return new Response(JSON.stringify({data: result[0]}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};
