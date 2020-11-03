import { Link, routes } from '@redwoodjs/router'
import { Flash } from '@redwoodjs/web'
import { useAuth } from '@redwoodjs/auth'

const MainLayout = (props) => {
  const { isAuthenticated, currentUser, logOut } = useAuth()

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
            <a className="rw-button rw-button-green" href="#" onClick={logOut}>
              Log Out
            </a>
          </>
        ) : (
          <>
            <h1 className="rw-heading rw-heading-primary">
              <Link to={routes.home()} className="rw-link">
                Welcome, Anonymous
              </Link>
            </h1>
            <Link to={routes.login()} className="rw-button rw-button-green">
              Login
            </Link>
            <Link to={routes.register()} className="rw-button rw-button-green">
              Register
            </Link>
          </>
        )}
      </header>
      <main className="rw-main">{props.children}</main>
    </div>
  )
}

export default MainLayout
