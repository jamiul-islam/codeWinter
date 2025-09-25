import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm' // AES with authentication
const IV_LENGTH = 16 // 128-bit IV
const TAG_LENGTH = 16 // 128-bit authentication tag

// Encrypt the API key
export function encryptApiKey(apiKey: string): string {
  try {
    const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY
    if (!encryptionKey) throw new Error('Encryption key not found')

    const secretKey = Buffer.from(encryptionKey, 'hex')
    if (secretKey.length !== 32)
      throw new Error('SECRET_KEY must be 32 bytes (64 hex characters)')

    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(ALGORITHM, secretKey, iv)

    const encrypted = Buffer.concat([
      cipher.update(apiKey, 'utf8'),
      cipher.final(),
    ])
    const tag = cipher.getAuthTag()

    // Return iv:tag:encrypted as hex string
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`
  } catch (error: any) {
    console.error('Failed to encrypt API key:', error)
    throw error
  }
}

// Decrypt the API key
export function decryptApiKey(encryptedString: string): string {
  try {
    const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY
    if (!encryptionKey) throw new Error('Encryption key not found')

    const secretKey = Buffer.from(encryptionKey, 'hex')
    if (secretKey.length !== 32)
      throw new Error('SECRET_KEY must be 32 bytes (64 hex characters)')

    const [ivHex, tagHex, encryptedHex] = encryptedString.split(':')
    const iv = Buffer.from(ivHex, 'hex')
    const tag = Buffer.from(tagHex, 'hex')
    const encryptedText = Buffer.from(encryptedHex, 'hex')

    const decipher = crypto.createDecipheriv(ALGORITHM, secretKey, iv)
    decipher.setAuthTag(tag)

    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ])
    return decrypted.toString('utf8')
  } catch (error: any) {
    console.error('Failed to decrypt API key:', error)
    throw error
  }
}

// Mask the API key (UI-friendly)
export function maskApiKey(apiKey: string, visibleChars = 4): string {
  if (!apiKey) {
    return ''
  }
  const len = apiKey.length
  if (len <= visibleChars) {
    return '*'.repeat(len - 1) + apiKey.slice(-1)
  }
  return '*'.repeat(len - visibleChars) + apiKey.slice(-visibleChars)
}

// Verify the API key
export async function verifyGeminiAPIKey(apiKey: string) {
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`

  try {
    const response = await fetch(apiUrl)
    console.log('Response Status:', response)

    if (response.ok) {
      // The response status is in the 200-299 range, which indicates success.
      console.log('The API key is valid!')
      return true
    } else {
      // The response status is an error (e.g., 401 Unauthorized, 403 Forbidden).
      const errorData = await response.json()
      const errorMessage = errorData.error?.message || 'Invalid API key'
      console.error(`API key validation failed: ${errorMessage}`)
      return false
    }
  } catch (error: any) {
    // This catches network errors or other issues.
    console.error(`An error occurred: ${error.message}`)
    return false
  }
}
