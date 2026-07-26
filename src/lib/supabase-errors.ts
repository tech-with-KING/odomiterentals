/**
 * Turns the database's own guardrails into something an admin can act on.
 * Postgres constraint violations arrive as codes and raw row dumps, which are
 * not a message anyone should see in a form.
 */
export function friendlyDbError(error: { code?: string; message?: string } | null): string {
  if (!error) return 'Something went wrong. Please try again.';

  if (error.code === '23514' && error.message?.includes('sale_price')) {
    return 'The sale price has to be lower than the regular price.';
  }
  if (error.code === '23505') {
    return 'That already exists. Use a different value.';
  }
  if (error.code === '23503') {
    return 'That reference is no longer valid — reload the page and try again.';
  }

  return error.message || 'Something went wrong. Please try again.';
}
