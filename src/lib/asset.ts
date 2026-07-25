const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return `${BASE}/${path}`;
  return `${BASE}${path}`;
}
