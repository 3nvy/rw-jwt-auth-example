/**
 * CUSTOM JWT AUTH IDENTITY
 */

import { AuthenticationError } from '@redwoodjs/api'
import jwt from 'jsonwebtoken'

import { db } from 'src/lib/db'

/**
 * Converts a string of cookies into an object
 * @param {*} cookies
 */
const parseCookiesHeader = (cookies) =>
  cookies
    .get('cookie')
    .split('; ')
    .reduce((acc, i) => {
      const [k, v] = i.split('=')
      acc[k] = v
      return acc
    }, {})

/**
 * Verifies if the token passed is valid and/or expired
 * @param {*} token
 */
export const verifyToken = (token) => {
  try {
    // Returns if the token is both valid and not expired
    const data = jwt.verify(token, 'SUPER_SECRET')
    return { valid: true, expired: false, data }
  } catch (err) {
    // Returns if the token is valid but expired
    if (err && err.name === 'TokenExpiredError')
      return {
        valid: true,
        expired: true,
        data: jwt.decode(token, 'SUPER_SECRET'),
      }

    // Returns if the token is not valid
    return { valid: false, expired: false, data: {} }
  }
}

/**
 * Invalidate Auth Cookies by expire them
 */
export const invalidateJWTTokens = () => {
  context.responseHeaders.set('set-cookie', [
    `refreshToken=; Path=/; HttpOnly; expires=Thu, 01 Jan 1970 00:00:01 GMT`,
    `accessToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`,
  ])
}

/**
 * Generate Auth Token Cookies
 * @param {*} param0
 */
export const generateJWTTokens = ({ id, email, username }) => {
  // Generate Refresh Token
  const refreshToken = jwt.sign({ id, email, username }, 'SUPER_SECRET', {
    expiresIn: '1d',
  })

  // Generate Access Token
  const accessToken = jwt.sign({ id, email, username }, 'SUPER_SECRET', {
    expiresIn: '15m',
  })

  context.responseHeaders.set('set-cookie', [
    `refreshToken=${refreshToken}; Path=/; HttpOnly;`, //Refresh token is set as HttpOnly so it cant be hijacked with scripting
    `accessToken=${accessToken}; Path=/;`,
  ])

  return refreshToken
}

/**
 * VERIFIES AUTH TOKENS
 *
 * If one or both tokens are either invalid or expired, an exceptions is thrown
 *
 * If the accessToken is expired but the refreshToken is valid and not expired, a new pair of accessToken and refreshToken are generated,
 * the new refreshToken is saved on the db and both are send on the response headers
 *
 * RefreshTokens are always compared against the refreshToken on the db for that user, in order to invalidate previous valid refreshTokens
 */
export const verifyJWTAuth = async () => {
  const {
    valid: accessTokenIsValid,
    expired: accessTokenIsExpired,
  } = verifyToken(context.currentUser.token)

  // Throws if accessToken isnt valid
  if (!accessTokenIsValid)
    throw new AuthenticationError('Invalid Token Provided.')

  // Tries to refresh accessToekn if its expired
  if (accessTokenIsExpired) {
    const { refreshToken } = parseCookiesHeader(context.requestHeaders)

    // Throws if no refreshToken is present
    if (!refreshToken) throw new AuthenticationError('Invalid Token Provided.')

    const {
      valid: refreshTokenIsValid,
      expired: refreshTokenIsExpired,
    } = verifyToken(refreshToken)

    // Throws if refreshToken is either invalid or expired
    if (!refreshTokenIsValid || refreshTokenIsExpired)
      throw new AuthenticationError('Invalid Token Provided.')

    // Gets user to fetch stored refreshToken
    const user = await db.user.findOne({
      where: { id: context.currentUser.id },
    })

    // Throws if refreshToken from db and the one from the headers dont match
    if (user.refreshToken !== refreshToken)
      throw new AuthenticationError('Invalid Token Provided.')

    // Generates new pair of accessToken and refreshToken and saves the new refreshToken on the db
    const newRefreshToken = generateJWTTokens(user)
    await db.user.update({
      data: { refreshToken: newRefreshToken },
      where: { id: user.id },
    })
  }
}
