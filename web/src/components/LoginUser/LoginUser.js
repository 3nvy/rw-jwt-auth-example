import { useState } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'

import LoginForm from 'src/components/LoginForm'

const LoginUser = () => {
  const { logIn } = useAuth()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onLogin = (input) => {
    setLoading(true)
    logIn(input)
      .then(() => navigate(routes.home()))
      .catch((err) => {
        const message = err.response.data?.errors[0]?.message
        setError({
          graphQLErrors: [
            {
              message,
              extensions: { exception: {} },
            },
          ],
        })
        setLoading(false)
      })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">Login</h2>
      </header>
      <div className="rw-segment-main">
        <LoginForm onSave={onLogin} loading={isLoading} error={error} />
      </div>
    </div>
  )
}

export default LoginUser
