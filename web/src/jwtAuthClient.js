import { HttpLink, ApolloLink, concat } from '@apollo/client'
import axios from 'axios'
import jwt from 'jsonwebtoken'

const localStorageManager = (key, value) => {
  if (value) localStorage.setItem(key, JSON.stringify(value))
  return JSON.parse(localStorage.getItem(key))
}

/**
 * ApolloClient middleware to check for token expiracy and refreshing
 */
const AuthMiddleware = () => {
  const httpLink = new HttpLink({
    uri: `${window.__REDWOOD__API_PROXY_PATH}/graphql`,
  })

  const authMiddleware = new ApolloLink(async (operation, forward) => {
    try {
      const token = localStorageManager('rw_jwt_user').accessToken
      const { exp } = jwt.decode(token)

      // Checks if access token has expired and refreshs tokens before proceeding
      if (exp * 1000 < Date.now()) {
        const data = await axios.get(
          `${window.__REDWOOD__API_PROXY_PATH}/jwtRefresh`
        )
        localStorageManager('rw_jwt_user', data?.data?.data || {})
      }

      const accessToken = localStorageManager('rw_jwt_user')?.accessToken
      // Set headers for next operation
      accessToken &&
        operation.setContext({
          headers: {
            'auth-provider': 'custom',
            authorization: `Bearer ${accessToken}`,
          },
        })
    } catch (err) {
      localStorage.removeItem('rw_jwt_user')
    }

    return forward(operation)
  })

  return { link: concat(authMiddleware, httpLink) }
}

/**
 * Custom Auth Provider Client
 */
const JWTAuthClient = {
  type: 'custom',
  login: ({ password, email }) =>
    new Promise((resolve, reject) => {
      axios
        .post(`${window.__REDWOOD__API_PROXY_PATH}/jwtLogin`, {
          password,
          email,
        })
        .then(({ data: { data } }) => {
          localStorage.setItem('rw_jwt_user', JSON.stringify(data))
          return resolve(data)
        })
        .catch(reject)
    }),
  signup: ({ password, email, username }) =>
    new Promise((resolve, reject) => {
      axios
        .post(`${window.__REDWOOD__API_PROXY_PATH}/jwtSignup`, {
          password,
          email,
          username,
        })
        .then(({ data: { data } }) => {
          localStorage.setItem('rw_jwt_user', JSON.stringify(data))
          return resolve(resolve)
        })
        .catch(reject)
    }),
  logout: () => {
    const token = JSON.parse(localStorage.getItem('rw_jwt_user') || {})
      .accessToken
    axios
      .put(`${window.__REDWOOD__API_PROXY_PATH}/jwtLogout`, { token })
      .finally(() => {
        localStorage.removeItem('rw_jwt_user')
      })
  },
  getToken: () => {
    const token = JSON.parse(localStorage.getItem('rw_jwt_user') || {})
      .accessToken

    const decoded = jwt.decode(token)
    if (!decoded) {
      localStorage.removeItem('rw_jwt_user')
      throw Error('Invalid AccessToken')
    }
    return token
  },
  getUserMetadata: () => {
    return JSON.parse(localStorage.getItem('rw_jwt_user') || {})
  },
}

export { AuthMiddleware, JWTAuthClient }
