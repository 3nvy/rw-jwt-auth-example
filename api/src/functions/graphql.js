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
      requestDidStart(requestContext) {
        requestContext.response.http.headers = new Map(
          requestContext.response.http.headers
        )
        context['responseHeaders'] = requestContext.response.http.headers
        context['requestHeaders'] = requestContext.request.http.headers
      },
    },
  ],
})
