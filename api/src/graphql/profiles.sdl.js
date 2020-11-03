export const schema = gql`
  type Profile {
    id: String!
    username: String!
    user: User
    userId: String
  }

  type Query {
    profiles: [Profile!]!
  }
`
