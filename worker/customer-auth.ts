import { createRemoteJWKSet, jwtVerify } from 'jose';

// Google's Secure Token signing keys, rotated by Google and cached by jose.
const keys = createRemoteJWKSet(new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'));

export async function customerUid(request: Request, projectId?: string): Promise<string | null> {
  const authorization = request.headers.get('Authorization');
  if (!authorization || !projectId) return null;
  const match = /^Bearer ([^\s]+)$/.exec(authorization);
  if (!match) return null;
  try {
    const { payload } = await jwtVerify(match[1], keys, {
      algorithms: ['RS256'], issuer: `https://securetoken.google.com/${projectId}`, audience: projectId,
    });
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.sub !== 'string' || !payload.sub || payload.sub.length > 128 ||
        typeof payload.iat !== 'number' || payload.iat > now ||
        typeof payload.auth_time !== 'number' || payload.auth_time > now ||
        typeof payload.exp !== 'number') return null;
    return payload.sub;
  } catch { return null; }
}
