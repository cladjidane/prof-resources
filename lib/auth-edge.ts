const TOKEN_MAX_AGE = 60 * 60 * 24 // 24h en secondes

export async function verifyTokenEdge(token: string, secret: string): Promise<boolean> {
  if (!secret) return false
  const dotIndex = token.indexOf('.')
  if (dotIndex === -1) return false
  const payload = token.substring(0, dotIndex)
  const signature = token.substring(dotIndex + 1)
  if (!payload || !signature) return false

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  const expected = Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')

  // Constant-time comparison
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  }
  if (diff !== 0) return false

  const timestamp = parseInt(payload, 10)
  if (isNaN(timestamp)) return false
  return (Date.now() / 1000 - timestamp) < TOKEN_MAX_AGE
}
