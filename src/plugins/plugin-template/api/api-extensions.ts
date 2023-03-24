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
    totalPrice: Int
  }

  extend type Query {
    exampleQuery(input: SearchExampleInput!): ExampleList!
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

  input SearchExampleInput {
    id: ID
    title: String
    description: String
  }

  type ResponseDelete{
    code: String!
    message: String
  }

  input registerCustomerInput {
    emailAddress: String
    title: String
    firstName: String
    lastName: String
    phoneNumber: String
    password: String
  }

  type ResponseRegister{
    code: String!
    message: String
  }


  extend type Mutation {
    insertExample(input: ExampleInput!): Example!
    updateExample(input: UpdateExampleInput!): Example!
    deleteExample(id: ID!): ResponseDelete!
    registerCustomerAccountCustom(input: registerCustomerInput!): ResponseRegister!  
  }

`;
