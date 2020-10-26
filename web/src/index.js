import ReactDOM from 'react-dom'
import { AuthProvider } from '@redwoodjs/auth'
import { RedwoodProvider, FatalErrorBoundary } from '@redwoodjs/web'

import FatalErrorPage from 'src/pages/FatalErrorPage'
import Routes from 'src/Routes'
import JWTAuth from 'src/auth'

import './scaffold.css'
import './index.css'

ReactDOM.render(
  <FatalErrorBoundary page={FatalErrorPage}>
    {/* Use local JWT Auth Client and set AUthProvider type to custom */}
    <AuthProvider client={JWTAuth} type="custom">
      <RedwoodProvider>
        <Routes />
      </RedwoodProvider>
    </AuthProvider>
  </FatalErrorBoundary>,
  document.getElementById('redwood-app')
)
