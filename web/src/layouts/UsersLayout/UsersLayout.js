import { useMutation } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'
import { Flash } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'
import Cookies from 'js-cookie'

const LOGOUT_USER_MUTATION = gql`
  mutation LogoutUserMutation($accessToken: String!) {
    logoutUser(accessToken: $accessToken)
  }
`

const UsersLayout = (props) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()
  const [logoutUser, { loading, error }] = useMutation(LOGOUT_USER_MUTATION, {
    onCompleted: () => {
      logOut()
    },
  })

  const logoutFn = () => {
    logoutUser({ variables: { accessToken: Cookies.get('accessToken') } })
  }

  return (
    <div className="rw-scaffold">
      <Flash timeout={1000} />
      <header className="rw-header">
        {isAuthenticated ? (
          <>
            <h1 className="rw-heading rw-heading-primary">
              <Link to={routes.home()} className="rw-link">
                Welcome, {currentUser.username}
              </Link>
            </h1>
            <Link
              to={routes.adminPosts()}
              className="rw-button rw-button-green"
            >
              Posts
            </Link>
            <a
              className="rw-button rw-button-green"
              href="#"
              onClick={logoutFn}
            >
              Log Out
            </a>
          </>
        ) : (
          <>
            <h1 className="rw-heading rw-heading-primary">
              <Link to={routes.home()} className="rw-link">
                Users
              </Link>
            </h1>
            <Link to={routes.loginUser()} className="rw-button rw-button-green">
              Login
            </Link>
            <Link to={routes.newUser()} className="rw-button rw-button-green">
              <div className="rw-button-icon">+</div> Register
            </Link>
          </>
        )}
      </header>
      <main className="rw-main">{props.children}</main>
    </div>
  )
}

export default UsersLayout
