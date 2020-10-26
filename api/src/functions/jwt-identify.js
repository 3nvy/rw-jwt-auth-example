import { AuthenticationError } from '@redwoodjs/api'
import jwt from 'jsonwebtoken'

import { db } from 'src/lib/db'

const parseCookiesHeader = (cookies) =>
  cookies
    .get('cookie')
    .split('; ')
    .reduce((acc, i) => {
      const [k, v] = i.split('=')
      acc[k] = v
      return acc
    }, {})

export const verifyToken = (token) => {
  try {
    const data = jwt.verify(token, 'SUPER_SECRET')
    return { valid: true, expired: false, data }
  } catch (err) {
    if (err && err.name === 'TokenExpiredError')
      return {
        valid: true,
        expired: true,
        data: jwt.decode(token, 'SUPER_SECRET'),
      }

    return { valid: false, expired: false, data: {} }
  }
}

export const invalidateJWTTokens = () => {
  context.responseHeaders.set('set-cookie', [
    `refreshToken=; Path=/; HttpOnly; expires=Thu, 01 Jan 1970 00:00:01 GMT`,
    `accessToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`,
  ])
}

export const generateJWTTokens = ({ id, email, username }) => {
  const refreshToken = jwt.sign({ id, email, username }, 'SUPER_SECRET', {
    expiresIn: '1d',
  })
  const accessToken = jwt.sign({ id, email, username }, 'SUPER_SECRET', {
    expiresIn: '10s',
  })

  context.responseHeaders.set('set-cookie', [
    `refreshToken=${refreshToken}; Path=/; HttpOnly;`,
    `accessToken=${accessToken}; Path=/;`,
  ])

  return refreshToken
}

export const verifyJWTAuth = async () => {
  const {
    valid: accessTokenIsValid,
    expired: accessTokenIsExpired,
  } = verifyToken(context.currentUser.token)

  if (!accessTokenIsValid)
    throw new AuthenticationError('Invalid Token Provided.')

  if (accessTokenIsExpired) {
    const { refreshToken } = parseCookiesHeader(context.requestHeaders)

    // Error if no RefreshToken Present
    if (!refreshToken) throw new AuthenticationError('Invalid Token Provided.')

    // Check if refreshToken is valid
    const {
      valid: refreshTokenIsValid,
      expired: refreshTokenIsExpired,
    } = verifyToken(refreshToken)

    if (!refreshTokenIsValid || refreshTokenIsExpired)
      throw new AuthenticationError('Invalid Token Provided.')

    //Generate New Access Token
    const user = await db.user.findOne({
      where: { id: context.currentUser.id },
    })

    if (user.refreshToken !== refreshToken)
      throw new AuthenticationError('Invalid Token Provided.')

    const newRefreshToken = generateJWTTokens(user)
    await db.user.update({
      data: { refreshToken: newRefreshToken },
      where: { id: user.id },
    })
  }
}
