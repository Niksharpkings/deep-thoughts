const timeElapsed = Date.now();
const today = new Date(timeElapsed);

const express = require("express");

// import ApolloServer
const { ApolloServer } = require("apollo-server-express");

const path = require("path");
// import our typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

const { authMiddleware } = require("./utils/auth");

const db = require("./config/connection");

const PORT = process.env.PORT || 3001;

// create a new Apollo server and pass in our schema data
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}
// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`
    Connection 🟢
    ${today.toUTCString()}
    Budget-Tracker App ⚡On 127.0.0.1:${PORT}!✅
    Performance:${performance.now()}
    `);
      // log where we can go to test our GQL API
      console.log(`
    Connection 🟢
    ⚡Running GraphQL at http://127.0.0.1:${PORT}${server.graphqlPath}
    ${today.toUTCString()}
    Performance:${performance.now()}
    `);
    });
  });
};

// Call the async function to start the server
startApolloServer(typeDefs, resolvers);
