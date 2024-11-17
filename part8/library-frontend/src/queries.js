import { gql } from "@apollo/client";

const ALL_AUTHORS = gql`
query AllAuthors {
  allAuthors {
    name
    born
    bookCount
  }
}
`;

const ALL_BOOKS = gql`
query Query {
  allBooks {
    title
    author
    published
  }
}
`
const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!,
    $author: String!,
    $published: Int!,
    $genres: [String!]!
  ) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author
      published
      genres
      id
    }
  }
`;

const EDIT_AUTHOR = gql`
mutation editAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
      bookCount
      id
    }
  }
`


export {ALL_AUTHORS, ALL_BOOKS, CREATE_BOOK, EDIT_AUTHOR}
