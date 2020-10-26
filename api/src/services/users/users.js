import { db } from 'src/lib/db'
import bcrypt from 'bcryptjs'

import { requireAuth } from 'src/lib/auth'
import {
  generateJWTTokens,
  invalidateJWTTokens,
  verifyToken,
} from 'src/functions/jwt-identify'

export const users = async () => {
  await requireAuth()
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

export const logoutUser = async ({ accessToken }) => {
  debugger
  const { valid, data: user } = verifyToken(accessToken)
  if (valid) {
    await db.user.update({
      data: { refreshToken: '' },
      where: { id: user.id },
    })
  }
  invalidateJWTTokens()
}
