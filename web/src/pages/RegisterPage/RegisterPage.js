import { routes, Redirect } from '@redwoodjs/router'
import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import RegisterUser from 'src/components/RegisterUser'

const RegisterPage = () => {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) return <Redirect to={routes.home()} />

  return (
    <MainLayout>
      <RegisterUser />
    </MainLayout>
  )
}

export default RegisterPage
