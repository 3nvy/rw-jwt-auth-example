import { useMutation, useFlash } from '@redwoodjs/web'
import { navigate, routes } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import LoginForm from 'src/components/LoginForm'

const LOGIN_USER_MUTATION = gql`
  mutation LoginUserMutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      id
      username
      email
    }
  }
`

const LoginUser = () => {
  const { addMessage } = useFlash()
  const { logIn } = useAuth()
  const [loginUser, { loading, error }] = useMutation(LOGIN_USER_MUTATION, {
    onCompleted: ({ loginUser: userData }) => {
      logIn(userData)
      navigate(routes.home())
      addMessage('User created.', { classes: 'rw-flash-success' })
    },
  })

  const onSave = (input) => {
    loginUser({ variables: input })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New User</h2>
      </header>
      <div className="rw-segment-main">
        <LoginForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default LoginUser
