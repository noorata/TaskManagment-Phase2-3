import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";   
import authenticate from './middleware/auth.js';  // نفس الشيء

import { ApolloServer } from "apollo-server-express";
import rateLimit from "express-rate-limit";

import { mergeTypeDefs } from '@graphql-tools/merge';
import { mergeResolvers } from '@graphql-tools/merge';

import userTypeDefs from "./graphql/Usertypedef.js";
import projectTypeDefs from "./graphql/project.typeDefs.js";
import taskTypeDefs from "./graphql/tasktyedef.js";

import userResolvers from "./graphql/user.resolvers.js";
import projectResolvers from "./graphql/project.resolves.js";
import taskResolver from './graphql/task.resolver.js'; 

dotenv.config();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 10000, // 10 محاولات فقط
  message: "لقد تجاوزت عدد المحاولات المسموحة. حاول لاحقًا.",
});

const typeDefs = mergeTypeDefs([userTypeDefs, projectTypeDefs, taskTypeDefs]);
const resolvers = mergeResolvers([userResolvers, projectResolvers, taskResolver]);

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const operation = req.body?.operationName;

         const query = req.body?.query || "";

    // اسمح بدون توكن لـ RegisterUser, Login, وأيضًا لو الاستعلام فيه admins
    if (["RegisterUser", "Login"].includes(operation) || query.includes("admins")|| query.includes("students")) {
      return {};
    }
 if (query.includes("admins")|| query.includes("students")) {
    // اسمح بدون توكن
    return next();
  }
      const user = authenticate(req);
      return { user };
    },
  
    models: {
      User: (await import('./models/UserModel.js')).default,
      Project: (await import('./models/projectModel.js')).default,
    }
  });

  await server.start();

  const app = express();

  app.use("/graphql", authLimiter);

server.applyMiddleware({
  app,
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  }
});


  await connectDB();

  app.listen(4000, () => {
    console.log("Server is running at http://localhost:4000/graphql");
  });
};

startServer();
