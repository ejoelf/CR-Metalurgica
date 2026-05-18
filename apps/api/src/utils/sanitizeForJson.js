export function sanitizeForJson(value) {
  if (value === null || value === undefined) return value;

  if (typeof value === 'bigint') return value.toString();

  if (value instanceof Date) return value.toISOString();

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeForJson(item));
  }

  if (typeof value === 'object') {
    if (typeof value.toJSON === 'function') {
      return value.toJSON();
    }

    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeForJson(item)])
    );
  }

  return value;
}
