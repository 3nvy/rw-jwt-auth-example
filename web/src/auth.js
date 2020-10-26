/**
 * ### CUSTOM LOCAL JWT AUTH CLIENT ###
 *
 * Simple JWT client that looks for an accessToken coockie for authentication
 */

import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

const JWTAuth = {
  type: 'custom',
  login: (userData) => userData,
  logout: () => Cookies.remove('accessToken'),
  getToken: () => Cookies.get('accessToken'),
  getUserMetadata: () => {
    const token = Cookies.get('accessToken')
    const { username, email } = jwt.decode(token)
    return {
      username,
      email,
    }
  },
}

export default JWTAuth
