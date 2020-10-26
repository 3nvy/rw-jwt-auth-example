import { db } from 'src/lib/db'
import bcrypt from 'bcryptjs'

import {
  generateJWTTokens,
  invalidateJWTTokens,
  verifyToken,
} from 'src/functions/jwt-identify'

export const users = () => {
  return db.user.findMany()
}

export const user = ({ id }) => {
  return db.user.findOne({
    where: { id },
  })
}

export const createUser = async ({ input }) => {
  const password = await bcrypt.hash(input.password, 12)
  const user = db.user.create({
    data: { ...input, password },
  })
  return user
}

export const updateUser = ({ id, input }) => {
  return db.user.update({
    data: input,
    where: { id },
  })
}

export const deleteUser = ({ id }) => {
  return db.user.delete({
    where: { id },
  })
}

/**
 * Logins User
 *
 * Uses bcrypt to compare passwords and generates JWT tokens if login data is valid
 * @param {*} param0
 */
export const loginUser = async ({ email, password }) => {
  const user = await db.user.findOne({
    where: { email },
  })
  const match = await bcrypt.compare(password, user.password)

  if (match) {
    const refreshToken = generateJWTTokens(user, db)
    await db.user.update({
      data: { refreshToken },
      where: { id: user.id },
    })
    return user
  }
  return false
}

/**
 * Logout User
 *
 * Logs out user by invalidating JWT tokens and remove refreshToken from db
 * @param {*} param0
 */
export const logoutUser = async ({ accessToken }) => {
  const { valid, data: user } = verifyToken(accessToken)

  // If the token is valid, it means theres a valid user data and we can proceed to update the db entry
  if (valid) {
    await db.user.update({
      data: { refreshToken: '' },
      where: { id: user.id },
    })
  }

  // Invalidates tokens
  invalidateJWTTokens()
}
