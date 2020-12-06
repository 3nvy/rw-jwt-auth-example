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
  // Gets refresh token from headers. Throws if non available
  const { refreshToken } = (event.headers.cookie || '')
    .split(';')
    .reduce((acc, el) => {
      const [k, v] = el.split('=')
      acc[k] = v
      return acc
    }, {})
  if (!refreshToken) return { statusCode: 400 }

  // Verifies if refresh token isnt expired. Throws if it is
  const [err, { email, exp, username } = {}] = await to(
    verifyToken(refreshToken)
  )
  if (err || exp * 1000 < Date.now()) return { statusCode: 400 }

  // Compares refreshToken with the one stored on the db. Throws if they dont match
  const { refreshToken: sRefreshToken, userRoles } = await db.user.findOne({
    where: { email },
    include: {
      profile: true,
      userRoles: true,
    },
  })

  if (refreshToken !== sRefreshToken) return { statusCode: 400 }

  // Parse available roles
  const roles = userRoles.map((role) => role.name)

  // Generates new pair of tokens
  const accessToken = jwt.sign(
    { email, username, roles },
    process.env.TOKEN_SIGN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }
  )
  const newRefreshToken = jwt.sign(
    { email, username, roles },
    process.env.TOKEN_SIGN_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }
  )

  // Update current user with refreshToken
  await db.user.update({
    data: { refreshToken: newRefreshToken },
    where: { email },
  })

  return {
    statusCode: 200,
    headers: {
      'set-cookie': [
        `refreshToken=${newRefreshToken}; Path=/; HttpOnly; ${
          process.env.USE_SECURE_COOKIES === 'true' && 'secure'
        }`,
      ],
    },
    body: JSON.stringify({
      data: {
        username,
        email,
        roles,
        accessToken,
      },
    }),
  }
}
