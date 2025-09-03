import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const summary = {
      url,
      url_ok: !!url,
      anon_len: anon?.length || 0,
      service_len: service?.length || 0,
      node: process.version,
      proxy: {
        HTTP_PROXY: process.env.HTTP_PROXY || process.env.http_proxy || undefined,
        HTTPS_PROXY: process.env.HTTPS_PROXY || process.env.https_proxy || undefined,
        NO_PROXY: process.env.NO_PROXY || process.env.no_proxy || undefined,
      },
    };

    if (!url || !service) {
      return res.status(500).json({ message: 'Missing env', summary });
    }

    // 1) Plain fetch to base URL
    let baseStatus: number | null = null;
    try {
      const r = await fetch(url, { method: 'HEAD' });
      baseStatus = r.status;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (summary as any)['base_error'] = msg;
    }

    // 2) REST ping with service key
    let restStatus: number | null = null;
    try {
      const r = await fetch(`${url}/rest/v1/`, {
        headers: { apikey: service },
      });
      restStatus = r.status;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (summary as any)['rest_error'] = msg;
    }

    // 3) Supabase client simple call
    let sbOk: boolean | string = false;
    try {
      const client = createClient(url, service, { auth: { autoRefreshToken: false, persistSession: false } });
      const { error } = await client.from('users').select('id').limit(1);
      if (error) sbOk = `error: ${error.message}`;
      else sbOk = true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      sbOk = `exception: ${msg}`;
    }

    return res.status(200).json({ summary, baseStatus, restStatus, sbOk });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return res.status(500).json({ message: 'debug route error', error: message });
  }
}
