import type { APIRoute } from 'astro';
import { CACHE_CONTROL, getAllItems } from '../../lib/feeds';

export const GET: APIRoute = async () => {
  const result = await getAllItems();
  return new Response(JSON.stringify(result), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': CACHE_CONTROL,
    },
  });
};
