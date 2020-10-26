import Post from 'src/components/Admin/Post'
import { routes, Redirect } from '@redwoodjs/router'

export const QUERY = gql`
  query FIND_POST_BY_ID($id: Int!) {
    post: post(id: $id) {
      id
      title
      body
      createdAt
    }
  }
`

export const Failure = () => <Redirect to={routes.home()} />

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Post not found</div>

export const Success = ({ post }) => {
  return <Post post={post} />
}
