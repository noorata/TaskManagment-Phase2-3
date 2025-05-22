import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Task {
    _id: ID!
    projecttitle: String!
    taskname: String!
    description: String
    assignedTo: User!
    project: Project!
    status: TaskStatus
    dueDate: String!
    createdBy: User!
  }

  enum TaskStatus {
    Pending
    InProgress
    OnHold
    Completed
    Cancelled
  }

  input AddTaskInput {
    projecttitle: String!
    taskname: String!
    description: String
    projectId: ID!
    assignedTo: ID!
    status: String
    dueDate: String!
  }

   

  type Query {
    getSortedTasks: [Task]
      taskCount: Int!

  }


type DeleteTaskResponse {
  success: Boolean!
  message: String!
  taskId: ID!
}

  type Mutation {
    addTask(input: AddTaskInput!): Task
  updateTask(id: ID!, input: AddTaskInput!): Task
    deleteTask(id: ID!): DeleteTaskResponse!

  }
`;

export default typeDefs;
