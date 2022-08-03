/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  ACCOUNT_ID: string;
  API_TOKEN: string;
}

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${env.ACCOUNT_ID}/images/v2/direct_upload`;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${env.API_TOKEN}`);

    const body = new FormData();

    // set this to "true" to protect the uploaded (preview) link with a signed URL
    body.append("requireSignedURLs", "false");

    const response = await fetch(url, {
      headers,
      method: "POST",
      body,
    });

    const myHeaders = new Headers(response.headers);
    myHeaders.set(
      "Access-Control-Allow-Origin",
      request.headers.get("Origin")!
    );

    return new Response(response.body, { status: 200, headers: myHeaders });
  },
};
