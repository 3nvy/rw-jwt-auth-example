import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { db } from 'src/lib/db'

export const handler = async (event, context) => {
  // Get user data from request body
  const { email, password } = event.queryStringParameters

  // Looks for existing user based on email
  const user = await db.user.findOne({
    where: { email },
    include: {
      profile: true,
      userRoles: true,
    },
  })

  // Throws if user cant be found with given credentials
  if (!user)
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: [{ message: `Wrong Credentials Provided` }],
      }),
    }

  // Deconstruct User Data
  const { profile: { username } = {}, password: sPassword, userRoles } = user

  // Check if passwords match. Throws if they dont
  const match = await bcrypt.compare(password, sPassword)
  if (!match)
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: [{ message: `Wrong Credentials Provided` }],
      }),
    }

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
    where: { email },
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
