import { useState } from 'react'
import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'

import RegisterForm from 'src/components/RegisterForm'

const RegisterUser = () => {
  const { signUp } = useAuth()
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const onRegister = (input) => {
    setLoading(true)
    signUp(input)
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
        <h2 className="rw-heading rw-heading-secondary">New User</h2>
      </header>
      <div className="rw-segment-main">
        <RegisterForm onSave={onRegister} loading={isLoading} error={error} />
      </div>
    </div>
  )
}

export default RegisterUser
