import { gql } from "apollo-server-express";

const typeDefsProject = gql`
  type Project {
    _id: ID!
    title: String!
    description: String
    students: [User!]
    category: String
    startDate: String
    endDate: String
    status: String
    createdBy: User
  }

  enum ProjectStatus {
    Pending
    InProgress
    Completed
    OnHold
    Cancelled
  }

  type Query {
    myProjectsCount: Int!
    completedProjectsCount: Int!
    myProjects(status: ProjectStatus, search: String): [Project!]!
  }

  input AddProjectInput {
    title: String!
    description: String
    students: [String!]!
    category: String
    startDate: String
    endDate: String
    status: ProjectStatus!
  }

  type Mutation {
    addProject(input: AddProjectInput!): Project
  }
`;

export default typeDefsProject;
