import { Link, routes, Redirect } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import Posts from 'src/components/Admin/Posts'

export const QUERY = gql`
  query POSTS {
    posts {
      id
      title
      body
      createdAt
    }
  }
`
export const Failure = () => {
  const { logOut } = useAuth()
  logOut()
  return <Redirect to={routes.home()} />
}

export const Loading = () => <div>Loading...</div>

export const Empty = () => {
  return (
    <div className="rw-text-center">
      {'No posts yet. '}
      <Link to={routes.adminNewPost()} className="rw-link">
        {'Create one?'}
      </Link>
    </div>
  )
}

export const Success = ({ posts }) => {
  return <Posts posts={posts} />
}
