import { useAuth } from '@redwoodjs/auth'

import UsersLayout from 'src/layouts/UsersLayout'
import PostsCell from 'src/components/Admin/PostsCell'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  return (
    <UsersLayout>
      {isAuthenticated ? <PostsCell /> : <p>User Is Loggedout</p>}
    </UsersLayout>
  )
}

export default HomePage
