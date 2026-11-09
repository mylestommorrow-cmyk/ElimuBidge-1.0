const requestTimestamps = new Map<string, number[]>();

export async function authorizeLiveAI(
  request: Request,
  _url?: string,
  _key?: string,
): Promise<"allowed" | "guest" | "limited"> {
  const header = request.headers.get("authorization");
  const clientIdentifier =
    (header?.startsWith("Bearer ") ? header.slice(7, 35) : null) ||
    request.headers.get("x-forwarded-for") ||
    "guest-client";

  const now = Date.now();
  const timestamps = requestTimestamps.get(clientIdentifier) || [];
  const recent = timestamps.filter((t) => now - t < 60000);

  if (recent.length >= 30) {
    return "limited";
  }

  recent.push(now);
  requestTimestamps.set(clientIdentifier, recent);

  return "allowed";
}
