import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    UserName: String!
    role: String
    universityId: String
    token: String
  }

  type Query {
    hello: String
    studentCount: Int!      
    students: [User!]!    
    admins:[User!]! 
  }

  type Mutation {
    login(UserName: String!, password: String!, staySignedIn: Boolean!): User
    register(
      UserName: String!
      password: String!
      universityId: String
      role: String
    ): User
  }
`;

export default typeDefs;
