/**
 * Canonical public origin, hardcoded on purpose.
 *
 * Supabase Auth redirects are pinned to this rather than to
 * window.location.origin so that a stale Site URL in the dashboard can never
 * bounce a signed-in user to localhost. Note the www — it must match the
 * Supabase Redirect URLs allow-list entry exactly.
 */
export const SITE_URL = 'https://www.odomiterentals.com';

/**
 * Base URL used when the server calls back into our own API routes.
 *
 * Resolution order:
 *   1. The incoming request's own origin — correct on production, preview
 *      deploys and local dev with zero configuration.
 *   2. NEXT_PUBLIC_APP_URL — explicit override, e.g. https://odomiterentals.com
 *   3. VERCEL_URL — set per-deployment by Vercel, host only, no scheme.
 *   4. localhost, for non-request contexts during local development.
 */
export function getAppBaseUrl(request?: Request): string {
  if (request) {
    const host =
      request.headers.get('x-forwarded-host') || request.headers.get('host');
    if (host) {
      const protocol =
        request.headers.get('x-forwarded-proto') ||
        (host.startsWith('localhost') || host.startsWith('127.0.0.1')
          ? 'http'
          : 'https');
      return `${protocol}://${host}`;
    }
  }

  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return 'http://localhost:3000';
}
