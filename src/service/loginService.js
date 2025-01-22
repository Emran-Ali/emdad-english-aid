import {router} from "next/client";
import {NextResponse as response} from "next/server";

export async function login(data) {
  const res = await fetch('/api/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if(res.ok) return router.route('user');

  return response.json();
}
