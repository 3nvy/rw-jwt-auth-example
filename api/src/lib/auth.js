import { AuthenticationError, ForbiddenError } from '@redwoodjs/api'
import jwt from 'jsonwebtoken'

import { verifyJWTAuth } from 'src/functions/jwt-identify'

/**
 * Decodes accessToken and returns relevante user data
 * @param {*} token
 */
export const getCurrentUser = (token) => ({ ...jwt.decode(token), token })

/**
 * Validates for auth permissions
 * @param {*} param0
 */
export const requireAuth = async ({ role } = {}) => {
  if (!context.currentUser) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  // Use custom JWT Auth to validate auth action by validating the header tokens
  // As we have async actions within this validation, we need to set this function as async and await for resolution
  await verifyJWTAuth()

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
