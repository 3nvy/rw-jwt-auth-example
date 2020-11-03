import { requireAuth } from 'src/lib/auth'

import { db } from 'src/lib/db'

export const users = () => {
  requireAuth({ role: 'admin' })
  return db.user.findMany()
}

export const User = {
  profile: (_obj, { root }) =>
    db.user.findOne({ where: { id: root.id } }).profile(),
}
