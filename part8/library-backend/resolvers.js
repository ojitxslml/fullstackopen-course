const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

const Author = require("./models/authors");
const Book = require("./models/books");
const User = require("./models/user");

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
        const authorsWithBookCount = await Author.aggregate([
          {
            $lookup: {
              from: "books", // Nombre de la colección de libros
              localField: "_id", // Campo en Author que referencia a Book
              foreignField: "author", // Campo en Book que referencia a Author
              as: "books", // Resultado del lookup, se almacenará en un campo "books"
            },
          },
          {
            $project: {
              name: 1, //El 1 en name significa que se incluira en el resultado, por defecto se ignora si no se espicifica con 1 o true
              born: 1,
              id: "$_id", //renombra el campo _id para que muestre el parametro id
              bookCount: { $size: "$books" }, // Número de libros
            },
          },
        ]);

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
        const savedBook = await book.save();

        // Actualizar el contador de libros del autor
        author.bookCount += 1;
        await author.save();

        // Poblar el autor después de guardar el libro
        const populatedBook = await Book.findById(savedBook._id).populate(
          "author"
        );

        // Verificar si el autor tiene un nombre válido
        if (!populatedBook.author || !populatedBook.author.name) {
          throw new GraphQLError("Author data is missing or invalid", {
            extensions: {
              code: "INTERNAL_ERROR",
            },
          });
        }

        // Publicar el libro añadido a los suscriptores
        pubsub.publish("BOOK_ADDED", { bookAdded: populatedBook });

        // Retornar el libro con el autor poblado
        return populatedBook;
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
