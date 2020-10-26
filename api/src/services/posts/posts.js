import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const posts = async () => {
  await requireAuth()
  return db.post.findMany()
}

export const post = async ({ id }) => {
  await requireAuth()
  return db.post.findOne({
    where: { id },
  })
}

export const createPost = async ({ input }) => {
  await requireAuth()
  return db.post.create({
    data: input,
  })
}

export const updatePost = async ({ id, input }) => {
  await requireAuth()
  return db.post.update({
    data: input,
    where: { id },
  })
}

export const deletePost = async ({ id }) => {
  await requireAuth()
  return db.post.delete({
    where: { id },
  })
}
