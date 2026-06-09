/**
 * Safely parse numeric input values from form fields.
 */

export function parseOptionalNumber(rawValue) {
  if (rawValue === "" || rawValue === null || rawValue === undefined) {
    return null;
  }
  const parsed = Number.parseFloat(rawValue);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseRequiredNumber(rawValue, fallback = 0) {
  const parsed = parseOptionalNumber(rawValue);
  return parsed === null ? fallback : parsed;
}
