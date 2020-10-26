import { AuthenticationError, ForbiddenError } from '@redwoodjs/api'
import jwt from 'jsonwebtoken'

import { verifyJWTAuth } from 'src/functions/jwt-identify'

export const getCurrentUser = (token) => ({ ...jwt.decode(token), token })

export const requireAuth = async ({ role } = {}) => {
  if (!context.currentUser) {
    throw new AuthenticationError("You don't have permission to do that.")
  }

  // Check for valid JWT tokens
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
