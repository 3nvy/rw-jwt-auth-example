import { AuthProvider } from '@redwoodjs/auth'
import ReactDOM from 'react-dom'
import { RedwoodProvider, FatalErrorBoundary } from '@redwoodjs/web'

import { AuthMiddleware, JWTAuthClient } from 'src/jwtAuthClient'
import FatalErrorPage from 'src/pages/FatalErrorPage'

import Routes from 'src/Routes'

import './index.css'
import './scaffold.css'

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    <AuthProvider client={JWTAuthClient} type="custom">
      <RedwoodProvider graphQLClientConfig={AuthMiddleware()}>
        <Routes />
      </RedwoodProvider>
    </AuthProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
