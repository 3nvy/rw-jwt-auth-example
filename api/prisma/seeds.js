/* eslint-disable no-console */
const bcrypt = require('bcryptjs')
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')

dotenv.config()
const db = new PrismaClient()

async function main() {
  // Seed data is database data that needs to exist for your app to run.
  // Ideally this file should be idempotent: running it multiple times
  // will result in the same database state (usually by checking for the
  // existence of a record before trying to create it). For example:
  //

  const { username, email, password, roles } = {
    username: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    roles: ['admin', 'user'],
  }

  const existing = await db.user.findMany({
    where: { email },
  })

  if (!existing.length) {
    const encryptedPassword = await bcrypt.hash(password, 12)
    await db.user.create({
      data: {
        password: encryptedPassword,
        email,
        profile: {
          create: { username },
        },
        userRoles: {
          create: roles.map((role) => ({ name: role })),
        },
      },
      include: {
        profile: true,
      },
    })
  }

  console.info('No data to seed. See api/prisma/seeds.js for info.')
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await db.$disconnect()
  })
