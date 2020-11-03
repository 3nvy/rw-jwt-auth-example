import { useAuth } from '@redwoodjs/auth'

import MainLayout from 'src/layouts/MainLayout'
import UsersCell from 'src/components/UsersCell'

const HomePage = () => {
  const { isAuthenticated } = useAuth()
  return (
    <MainLayout>
      {isAuthenticated ? (
        <>
          <p>User Is Loggedin</p>
          <UsersCell />
        </>
      ) : (
        <p>User Is Loggedout</p>
      )}
    </MainLayout>
  )
}

export default HomePage
