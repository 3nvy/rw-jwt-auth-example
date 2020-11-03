import to from 'await-to-js'

import { db } from 'src/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const handler = async (event, context) => {
  // Get user from request body
  const { email, password, username } = JSON.parse(event.body)

  // Encrypt password
  const encryptedPassword = await bcrypt.hash(password, 12)

  // Tries to create new user
  const [error, { id, userRoles } = {}] = await to(
    db.user.create({
      data: {
        password: encryptedPassword,
        email,
        profile: {
          create: { username },
        },
        userRoles: {
          create: { name: 'user' },
        },
      },
      include: {
        profile: true,
        userRoles: true,
      },
    })
  )

  // If theres an error on user creation, throws an error
  if (error)
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: [{ message: `${error.meta.target.join(',')} already exists` }],
      }),
    }

  // Parse available roles
  const roles = userRoles.map((role) => role.name)

  // Generate Auth tokens
  const accessToken = jwt.sign(
    { email, username, roles },
    process.env.TOKEN_SIGN_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_TIME,
    }
  )
  const refreshToken = jwt.sign(
    { email, username, roles },
    process.env.TOKEN_SIGN_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_TIME,
    }
  )

  // Update current user with refreshToken
  await db.user.update({
    data: { refreshToken },
    where: { id },
  })

  return {
    statusCode: 200,
    // Set auth cookies on response headers
    headers: {
      'set-cookie': [`refreshToken=${refreshToken}; Path=/; HttpOnly`],
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
