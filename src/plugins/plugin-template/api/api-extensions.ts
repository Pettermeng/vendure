import { gql } from "graphql-tag";

export const shopSchema = gql`

  type Example implements Node {
    id: ID!
    createdAt: DateTime!
    updatedAt: DateTime!
    title: String
    description: String
  }

  type ExampleList implements PaginatedList {
    items: [Example!]!
    totalItems: Int!
  }

  extend type Query {
    exampleQuery: ExampleList!
  }

  input ExampleInput {
      title: String
      description: String
  }

  input UpdateExampleInput {
    id: ID!
    title: String
    description: String
  }

  extend type Mutation {
    insertExample(input: ExampleInput!): Example!
    updateExample(input: UpdateExampleInput!): Example!
  }

`;
