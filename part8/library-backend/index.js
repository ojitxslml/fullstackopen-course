const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const Book = require("./models/books");
const Author = require("./models/authors");
const User = require("./models/user");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `

type User {
  username: String!
  favoriteGenre: String
  id: ID!
}

type Token {
  value: String!
}

type Book {
  title: String!
  published: Int!
  author: Author!
  id: ID!,
  genres: [String!]!
}

type Author{
  name: String!
  bookCount: Int!
  born: Int
  id: ID!
}

type Query {
  bookCount: Int!
  authorCount: Int!
  allBooks(author: String, genre: String): [Book!]!
  allAuthors: [Author!]!
  me: User
}

type Mutation{
  addBook(
  title: String!,
  author: String!,
  published: Int!,
  genres: [String!]!): Book

  editAuthor(
  name: String!,
  setBornTo: Int! 
): Author

createUser(
    username: String!
    favoriteGenre: String!
  ): User

  login(
    username: String!
    password: String!
  ): Token

}


`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => {
      try {
        const uniqueAuthors = await Book.distinct("author");
        return uniqueAuthors.length;
      } catch (err) {
        console.error("Error al obtener el número de autores:", err);
        return 0;
      }
    },
    // Comprobación en el backend
    allBooks: async (root, args) => {
      const { author, genre } = args;
      console.log(author, genre); // Para ver qué datos se están pasando como filtro

      try {
        let filter = {};

        if (author) {
          filter.author = author;
        }

        if (genre) {
          filter.genres = { $in: [genre] };
        }

        const books = await Book.find(filter).populate("author");
        console.log(books); // Asegúrate de que se devuelvan libros
        return books;
      } catch (error) {
        console.error("Error al obtener los libros:", error);
        return [];
      }
    },
    allAuthors: async () => {
      try {
        // Obtener todos los autores con el número de libros que tienen
        const authors = await Author.find({});

        // Para cada autor, contar el número de libros asociados
        const authorsWithBookCount = await Promise.all(
          authors.map(async (author) => {
            const booksCount = await Book.countDocuments({
              author: author._id,
            });
            return {
              ...author.toObject(),
              bookCount: booksCount,
            };
          })
        );

        return authorsWithBookCount;
      } catch (error) {
        console.error("Error al obtener los autores:", error);
        return [];
      }
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT " + error,
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      // Verificar si el autor existe
      let author = await Author.findOne({ name: args.author });

      if (!author) {
        try {
          // Crear un nuevo autor si no existe, inicializando bookCount a 0
          author = new Author({
            name: args.author,
            bookCount: 0,
          });
          await author.save();
        } catch (error) {
          throw new GraphQLError("Author creation failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              error,
            },
          });
        }
      }

      // Crear el libro
      const book = new Book({
        title: args.title,
        author: author._id, // Asociamos el autor al libro
        published: args.published,
        genres: args.genres,
      });

      try {
        // Guardar el libro
        await book.save();

        // Actualizar el contador de libros del autor
        author.bookCount += 1;
        await author.save();

        // Poblar el autor después de guardar el libro
        const savedBook = await Book.findById(book._id).populate("author");

        return savedBook;
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      }
    },

    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const author = await Author.findOne({ name: args.name });

      if (!author) {
        throw new GraphQLError("Author not found", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }

      author.born = args.setBornTo;

      try {
        const bookCount = await Book.countDocuments({ author: author.id });
        author.bookCount = bookCount;
        await author.save();
        return author;
      } catch (error) {
        throw new GraphQLError("Editing author failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (!auth) {
      return {};
    }

    if (auth && auth.startsWith("Bearer ")) {
      try {
        const decodedToken = jwt.verify(
          auth.substring(7),
          process.env.JWT_SECRET
        );
        const currentUser = await User.findById(decodedToken.id);

        if (!currentUser) {
          return {};
        }

        return { currentUser };
      } catch (error) {
        console.error("Error al autenticar usuario:", error);
        return {};
      }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});