const { gql } = require("apollo-server-express");

const typeDefs = gql`

type Book {
    _id: ID
    bookId: ID
    authors: [String]
    description: String
    title: String
    image: String
    link: String
}

`;