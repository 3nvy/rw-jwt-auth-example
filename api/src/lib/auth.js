import { AuthenticationError, ForbiddenError } from '@redwoodjs/api'
import jwt from 'jsonwebtoken'

const verifyToken = (token) => {
  try {
    // Returns if the token is both valid and not expired
    const data = jwt.verify(token, process.env.TOKEN_SIGN_KEY)
    return { valid: true, expired: false, data }
  } catch (err) {
    // Returns if the token is valid but expired
    if (err && err.name === 'TokenExpiredError')
      return {
        valid: true,
        expired: true,
        data: jwt.decode(token, process.env.TOKEN_SIGN_KEY),
      }

    // Returns if the token is not valid
    return { valid: false, expired: false, data: {} }
  }
}

export const getCurrentUser = async (token) => {
  const { valid, expired, data } = verifyToken(token)
  if (!valid) throw Error('Invalid Token Provided')

  return data ? { ...data, expired, roles: data.roles || [] } : false
}

export const requireAuth = ({ role } = {}) => {
  if (!context.currentUser || context.currentUser.expired) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  if (
    typeof role !== 'undefined' &&
    typeof role === 'string' &&
    !context.currentUser.roles?.includes(role)
  ) {
    throw new ForbiddenError("You don't have access to do that.")
  }

  if (
    typeof role !== 'undefined' &&
    Array.isArray(role) &&
    !context.currentUser.roles?.some((r) => role.includes(r))
  ) {
    throw new ForbiddenError("You don't have access to do that.")
  }
}
