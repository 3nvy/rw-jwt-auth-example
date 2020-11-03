import to from 'await-to-js'
import jwt from 'jsonwebtoken'

import { db } from 'src/lib/db'

/**
 * Verifies if token is valid
 * @param {*} token
 */
const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SIGN_KEY)
      resolve(decoded)
    } catch (err) {
      reject(err)
    }
  })

export const handler = async (event, context) => {
  const { token } = JSON.parse(event.body)

  // Removes refresh token from user db entry, if provided token is valid
  const [err, { email } = {}] = await to(verifyToken(token))
  if (!err) {
    await db.user.update({
      data: { refreshToken: '' },
      where: { email },
    })
  }

  // Expires token on cookies
  return {
    statusCode: 200,
    // Expire auth coockie headers
    headers: {
      'set-cookie': [
        `refreshToken=; Path=/; expires=Thu, Jan 01 1970 00:00:00 UTC;`,
      ],
    },
  }
}
