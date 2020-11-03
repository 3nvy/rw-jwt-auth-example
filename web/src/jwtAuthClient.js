import { HttpLink, ApolloLink, concat } from '@apollo/client'
import axios from 'axios'
import jwt from 'jsonwebtoken'

/**
 * ApolloClient middleware to check for token expiracy and refreshing
 */
const AuthMiddleware = () => {
  const httpLink = new HttpLink({
    uri: `${window.__REDWOOD__API_PROXY_PATH}/graphql`,
  })

  const authMiddleware = new ApolloLink(async (operation, forward) => {
    try {
      const token = JSON.parse(localStorage.getItem('rw_jwt_user')).accessToken
      const { exp } = jwt.decode(token)

      // Checks if access token has expired and refreshs tokens before proceeding
      if (exp * 1000 < Date.now()) {
        const data = await axios.get(
          `${window.__REDWOOD__API_PROXY_PATH}/jwtRefresh`
        )
        localStorage.setItem('rw_jwt_user', JSON.stringify(data?.data?.data))
      }
    } catch (err) {}

    // Set headers for next operation
    operation.setContext({
      headers: {
        'auth-provider': 'custom',
        authorization: `Bearer ${
          JSON.parse(localStorage.getItem('rw_jwt_user')).accessToken
        }`,
      },
    })

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
        .get(`${window.__REDWOOD__API_PROXY_PATH}/jwtLogin`, {
          params: {
            password,
            email,
          },
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
