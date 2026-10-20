// server-only helper for talking to the go backend
// API_BASE_URL is read on the server, so it never reaches the browser bundle
const baseUrl = (
  process.env.API_BASE_URL || 'http://localhost:8080/v1'
).replace(/\/$/, '');

export function backendUrl(path: string): string {
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
