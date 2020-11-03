export const schema = gql`
  type User {
    id: String!
    email: String!
    profile: Profile!
  }

  type Query {
    users: [User!]!
  }
`
