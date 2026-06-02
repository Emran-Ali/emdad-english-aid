import {team} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {eq} from 'drizzle-orm';
import {getServerSession} from "next-auth/next";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req) => {
  try {
    const data = await db.select().from(team).orderBy(team.order).execute();
    return new Response(JSON.stringify({data}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};

export const POST = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }

    const body = await req.json();
    const result = await db.insert(team).values(body).returning();
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
    const {id, ...updateData} = body;
    const result = await db.update(team)
      .set(updateData)
      .where(eq(team.id, id))
      .returning();

    return new Response(JSON.stringify({data: result[0]}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};

export const DELETE = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return new Response(JSON.stringify({message: 'Unauthorized'}), {status: 401});
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    await db.delete(team).where(eq(team.id, Number(id)));
    return new Response(JSON.stringify({message: 'Deleted'}), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({message: error.message}), {status: 500});
  }
};
