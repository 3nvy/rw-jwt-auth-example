import { routes, Redirect } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import LoginUser from 'src/components/LoginUser'

const LoginPage = () => {
  const { isAuthenticated } = useAuth()

  if(isAuthenticated) return <Redirect to={routes.home()} />

  return (
    <MainLayout>
      <LoginUser />
    </MainLayout>
  )
}

export default LoginPage
