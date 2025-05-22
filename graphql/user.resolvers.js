import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "http-errors";
import User from "../models/UserModel.js";
import { RateLimiterMemory } from "rate-limiter-flexible";
import { GraphQLError } from "graphql";
import registerSchema from '../validation/validation.js';

const secretKey = process.env.JWT_SECRET || "1234$";

const rateLimiter = new RateLimiterMemory({
  points: 1000,
  duration: 120,
  blockDuration: 120,
});

const resolvers = {
  Query: {
    studentCount: async (_, __, { models, user }) => {
      if (!user || user.role !== "admin") {
        throw new Error("Unauthorized: Admin access required.");
      }
      const count = await User.countDocuments({ role: "student" });
      return count;
    },

    students: async () => {
      return await User.find({ role: "student" });
    },
    
    admins: async () => {
      return await User.find({ role: "admin" });
    },
  },

  Mutation: {
    register: async (_, args) => {
      try {
        const { error, value } = registerSchema.validate(args);
        if (error) {
          throw new GraphQLError(error.details[0].message, {
            extensions: { code: "BAD_USER_INPUT", field: error.details[0].context.key }
          });
        }

        const { UserName, password, universityId } = value;

        const existingUser = await User.findOne({ UserName });
        if (existingUser) {
          throw new GraphQLError("This username is already taken.", {
            extensions: { code: "USER_NAME_ALREADY_EXISTS" }
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = universityId && universityId.trim() !== "" ? "student" : "admin";

        const newUser = new User({
          UserName,
          password: hashedPassword,
          universityId: universityId || null,
          role,
        });

        await newUser.save();

        const token = jwt.sign(
          { userId: newUser._id, role: newUser.role },
          secretKey,
          { expiresIn: "50h" }
        );

        return {
          id: newUser._id,
          UserName: newUser.UserName,
          role: newUser.role,
          universityId: newUser.universityId,
          token,
        };

      } catch (err) {
        if (!(err instanceof GraphQLError)) {
          console.error("Server Error:", err);
          throw new GraphQLError("Unexpected server error occurred.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" }
          });
        }
        throw err;
      }
    },

    login: async (_, { UserName, password, staySignedIn }) => {
      try {
        await rateLimiter.consume(UserName);

        const user = await User.findOne({ UserName });
        if (!user) {
          throw createError.Unauthorized("User not found.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          throw createError.Unauthorized("Incorrect password.");
        }

        const token = jwt.sign(
          { id: user._id, role: user.role, UserName: user.UserName },
          secretKey,
          { expiresIn: staySignedIn ? "30d" : "3h" }
        );

        if (!user.UserName) {
          throw createError.InternalServerError("Incomplete user data.");
        }
return {
  id: user._id,
  
  UserName: user.UserName,
  role: user.role,
  universityId: user.universityId,
  token,
  staySignedIn,
};

      } catch (err) {
        if (err.msBeforeNext) {
          throw createError.TooManyRequests(
            `Too many login attempts. Try again after ${Math.ceil(err.msBeforeNext / 1000)} seconds.`
          );
        }

        if (err.name === "JsonWebTokenError") {
          throw createError.InternalServerError("Failed to generate login token.");
        }

        if (err.name === "MongoError") {
          throw createError.InternalServerError("Database error.");
        }

        if (err.status === 401) {
          throw err;
        }

        console.error("Unexpected error:", err);
        throw createError.InternalServerError("An unexpected error occurred. Please try again later.");
      }
    },
  },
};
export default  resolvers;