import crypto from 'crypto'

const SECRET = process.env.ADMIN_SECRET || ''
const TOKEN_MAX_AGE = 60 * 60 * 24 // 24h en secondes

export function signToken(payload: string): string {
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
  return `${payload}.${signature}`
}

export function verifyToken(token: string): boolean {
  if (!SECRET) return false
  const dotIndex = token.indexOf('.')
  if (dotIndex === -1) return false
  const payload = token.substring(0, dotIndex)
  const signature = token.substring(dotIndex + 1)
  if (!payload || !signature) return false
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex')
  if (expected.length !== signature.length) return false
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false
  const timestamp = parseInt(payload, 10)
  if (isNaN(timestamp)) return false
  return (Date.now() / 1000 - timestamp) < TOKEN_MAX_AGE
}
