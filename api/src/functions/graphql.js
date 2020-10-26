import {
  createGraphQLHandler,
  makeMergedSchema,
  makeServices,
} from '@redwoodjs/api'

import schemas from 'src/graphql/**/*.{js,ts}'
import services from 'src/services/**/*.{js,ts}'

import { getCurrentUser } from 'src/lib/auth'
import { db } from 'src/lib/db'

export const handler = createGraphQLHandler({
  getCurrentUser,
  schema: makeMergedSchema({
    schemas,
    services: makeServices({ services }),
  }),
  onException: () => {
    // Disconnect from your database with an unhandled exception.
    db.$disconnect()
  },
  plugins: [
    {
      /**
       * Adds request and response headers to global context, so they can be read and/or changed at any point
       * @param {*} requestContext
       */
      requestDidStart(requestContext) {
        // Default Headers force values to be strings.
        // In our case, we want to have 2 sets of cookie values (set-cookie) with the same key, so we need to set both values as an array
        // For that, we are converting the Headers into a Map, which allows us to do just that.
        requestContext.response.http.headers = new Map(
          requestContext.response.http.headers
        )
        context['responseHeaders'] = requestContext.response.http.headers
        context['requestHeaders'] = requestContext.request.http.headers
      },
    },
  ],
})
