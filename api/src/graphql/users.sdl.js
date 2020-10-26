export const schema = gql`
  type User {
    id: Int!
    email: String!
    username: String!
    password: String!
    refreshToken: String
    createdAt: DateTime!
  }

  type Query {
    users: [User!]!
    user(id: Int!): User
  }

  input CreateUserInput {
    email: String!
    username: String!
    password: String!
  }

  input UpdateUserInput {
    email: String
    username: String
    password: String
    refreshToken: String
  }

  type Mutation {
    logoutUser(accessToken: String): Boolean
    loginUser(email: String!, password: String!): User!
    createUser(input: CreateUserInput!): User!
    updateUser(id: Int!, input: UpdateUserInput!): User!
    deleteUser(id: Int!): User!
  }
`
