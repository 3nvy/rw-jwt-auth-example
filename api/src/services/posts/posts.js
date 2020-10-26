import { requireAuth } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const posts = async () => {
  await requireAuth() // We need to set function as async and await for resolution in order for errors to be thrown
  return db.post.findMany()
}

export const post = async ({ id }) => {
  await requireAuth() // We need to set function as async and await for resolution in order for errors to be thrown
  return db.post.findOne({
    where: { id },
  })
}

export const createPost = async ({ input }) => {
  await requireAuth() // We need to set function as async and await for resolution in order for errors to be thrown
  return db.post.create({
    data: input,
  })
}

export const updatePost = async ({ id, input }) => {
  await requireAuth() // We need to set function as async and await for resolution in order for errors to be thrown
  return db.post.update({
    data: input,
    where: { id },
  })
}

export const deletePost = async ({ id }) => {
  await requireAuth() // We need to set function as async and await for resolution in order for errors to be thrown
  return db.post.delete({
    where: { id },
  })
}
